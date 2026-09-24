// flow.js — сама логика AI Restart: подготовка к перезагрузке, возврат языка после
// входа, аварийное восстановление. Состояние хранится в JSON рядом с логами.

var TX_FILE = 'transaction.json';
var PENDING_FILE = 'pending';
var RELAUNCH_FILE = 'relaunch.json';
var CHATGPT_ID = 'com.apple.openai.chatgpt';
var CHATGPT_WAIT = 15 * 60;   // сколько окно подключения ждёт «Готово»

function transaction() {
    return readJSON(statePath(TX_FILE));
}

// Каждая смена фазы остаётся в истории: по ней потом видно, где всё встало.
function archiveTx(tx, phase) {
    var updated = Object.assign({}, tx, { phase: phase, updatedAt: now() });
    writeJSON(statePath('transactions/' + updated.id + '.json'), updated);
    return updated;
}

function rollback() {
    var tx = transaction();
    if (!tx || ['preparing', 'prepared', 'rollback-failed'].indexOf(tx.phase) === -1) return;
    if (tx.bootUUID !== bootUUID()) throw new Error(t('error.otherBoot'));
    writePrefs(tx.original);
    writeJSON(statePath(TX_FILE), archiveTx(tx, 'rolled-back'));
    removePath(statePath(PENDING_FILE));
}

// --- перед перезагрузкой ----------------------------------------------------

// Эту настройку loginwindow читает при выходе — но только если событие перезагрузки
// пришло с параметром «state saving preference», который шлёт System Events (так и
// делает кнопка). Сырое событие loginwindow параметра не знает и сохраняет список всегда.
function setLogoutSavesState(value) {
    exec('/usr/bin/defaults', ['write', 'com.apple.loginwindow', 'TALLogoutSavesState',
                               '-bool', value ? 'true' : 'false']);
}

function readLogoutSavesState() {
    var r = exec('/usr/bin/defaults', ['read', 'com.apple.loginwindow', 'TALLogoutSavesState']);
    return r.code !== 0 || r.out.trim() !== '0';
}

// loginwindow ничего не открывает при входе; приложения откроет вход после смены языка.
function arm(reopen, apps) {
    writeJSON(statePath(RELAUNCH_FILE), {
        bootUUID: bootUUID(),
        reopenWindows: reopen,
        apps: reopen ? apps.map(function (item) {
            return { bundleID: item.bundleID, path: item.path, hidden: item.hidden };
        }) : [],
        quitKeepsWindows: readQuitKeepsWindows(),
        armedAt: now()
    });
    // Поимённо в журнал: иначе после перезагрузки не понять, какие программы
    // вообще попали в список на возврат.
    logLine('К ВОЗВРАТУ: ' + (reopen
        ? apps.map(function (item) { return item.bundleID || item.path; }).join(', ') || 'ничего'
        : 'галочка снята'));
    // Раньше здесь всегда стояло false, чтобы система не открывала приложения
    // сама (их открываем мы, уже после возврата языка). Но у Safari от этого
    // пропадали вкладки: свою прошлую сессию он восстанавливает после
    // перезагрузки, только если система вообще собиралась что-то восстанавливать.
    // Проверено: сеанс переживает перезагрузку (пункт «Открыть снова все окна из
    // последнего сеанса» в меню «История» остаётся живым), а сам Safari его
    // не поднимает. Двойного запуска при true не будет: к моменту выхода из
    // системы все приложения уже закрыты, и восстанавливать системе нечего.
    setLogoutSavesState(reopen);
}

// Ставит английский язык и помечает загрузку как ожидающую возврата.
function prepare(chatgpt) {
    var current = bootUUID();
    var old = transaction();
    if (old && old.phase === 'prepared' && old.bootUUID === current &&
        samePrefs(prefs(), englishFor(old.original))) {
        writeJSON(statePath(TX_FILE), Object.assign({}, old, { chatgptSetup: chatgpt }));
        writeJSON(statePath(PENDING_FILE), { id: old.id, bootUUID: current });
        return;
    }
    if (old && ['preparing', 'rollback-failed'].indexOf(old.phase) !== -1) {
        throw new Error(t('error.unfinished'));
    }
    var original = prefs();
    if (isEnglish(original)) {
        throw new Error(t('error.alreadyEnglish'));
    }
    var tx = { id: uuid(), bootUUID: current, phase: 'preparing', original: original,
               createdAt: now(), chatgptSetup: !!chatgpt };
    writeJSON(statePath(TX_FILE), tx);
    writeJSON(statePath(PENDING_FILE), { id: tx.id, bootUUID: current });
    try {
        writePrefs(englishFor(original));
        writeJSON(statePath(TX_FILE), archiveTx(tx, 'prepared'));
    } catch (error) {
        try {
            rollback();
        } catch (rollbackError) {
            writeJSON(statePath(TX_FILE), Object.assign({}, tx,
                { phase: 'rollback-failed', error: String(rollbackError.message || rollbackError) }));
        }
        throw error;
    }
}

// --- после входа ------------------------------------------------------------

// Открывает сохранённые приложения уже после смены языка (только в новой загрузке).
function finishRelaunch(openApps) {
    var state = readJSON(statePath(RELAUNCH_FILE));
    if (!state) return;
    if (openApps && state.bootUUID === bootUUID()) return;
    if (openApps) {
        var apps = state.apps || [];
        logLine('ОТКРЫВАЮ приложений: ' + apps.length + ' (галочка=' + !!state.reopenWindows + ')');
        apps.forEach(function (item) {
            if (!item.path || !exists(item.path)) {
                logLine('  ПРОПУСК (файла нет) ' + (item.bundleID || item.path));
                return;
            }
            openApp(item.path, item.hidden, item.bundleID);
            // Пишем поимённо: без этого по логу не понять, какая программа
            // открылась и с какими ключами (искали пропавшие вкладки Safari).
            logLine('  ОТКРЫТО' + (item.hidden ? ' скрытым' : '') + ' ' + (item.bundleID || item.path));
            // Список идёт сзади наперёд; без паузы приложения стартуют вперегонки
            // и порядок окон на экране получается случайным.
            sleep(0.8);
        });
    }
    setLogoutSavesState(!!state.reopenWindows);
    writeQuitKeepsWindows(state.quitKeepsWindows === undefined ? null : state.quitKeepsWindows);
    removePath(statePath(RELAUNCH_FILE));
}

function login() {
    try {
        loginBody();
    } finally {
        finishRelaunch(true);
        pruneDiagnostics();
    }
}

function loginBody() {
    var marker = statePath(PENDING_FILE);
    if (!exists(marker)) { logLine('Ожидающей перезагрузки нет'); return; }
    var current = bootUUID();
    var tx = transaction();
    if (tx && ['preparing', 'prepared', 'rollback-failed'].indexOf(tx.phase) !== -1 &&
        tx.bootUUID === current) {
        // Перезапуск в той же сессии не должен отменять подготовку, пока идёт выключение.
        logLine('Подготовлено в этой же загрузке — ждём новую. Ничего не меняем.');
        return;
    }
    if (!tx || !tx.original) {
        removePath(marker);
        throw new Error(t('error.markerNoOperation'));
    }
    var target = tx.original;
    var original = prefs();
    if (!samePrefs(original, englishFor(target))) {
        if (!isEnglish(original)) {
            // Обычная перезагрузка (меню Apple) после нажатия кнопки или язык вернули
            // вручную: переключать нечего, иначе метка осталась бы навсегда.
            if (tx.phase !== 'completed') writeJSON(statePath(TX_FILE), archiveTx(tx, 'abandoned'));
            removePath(marker);
            logLine('Метка убрана: это не английская загрузка');
            return;
        }
        throw new Error(t('error.notEnglishBoot'));
    }

    var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..*/, '').replace('T', '-');
    var directory = statePath('diagnostics/' + stamp);
    var result = waitForSiriReady(directory, true);
    writeJSON(statePath('last-readiness.json'), Object.assign({}, result, { diagnosticPath: directory }));
    var ready = result.status === 'ready';

    if (tx.chatgptSetup) {
        try { chatgptSetup(); } catch (error) { logLine('Подключение ChatGPT не удалось: ' + error.message); }
    }

    // Язык возвращаем в любом случае, даже если Siri AI не подтвердилась. Раньше
    // система оставалась английской, и человек без очевидной причины получал чужой
    // язык до следующей перезагрузки — особенно больно тем, кто ещё ждёт очереди
    // Apple Intelligence. Толку от английской сессии всё равно нет: готовность
    // решается при загрузке, а очередь и загрузка моделей смену языка переживают.
    var switchedAt = now();
    try {
        writePrefs(target);
    } catch (error) {
        writePrefs(original);
        throw error;
    }
    sleep(1);
    restartSiri();
    try {
        restartInterface(switchedAt);
    } catch (error) {
        logLine('Перезапуск интерфейса не удался: ' + error.message);
    }
    writeJSON(statePath(TX_FILE), archiveTx(Object.assign({}, tx, {
        completedBootUUID: current, evidence: result.evidence, diagnosticPath: directory
    }), ready ? 'completed' : 'completed-without-siri'));
    removePath(marker);

    if (ready) {
        logLine('ГОТОВО: язык возвращён после подтверждения Siri. ' + directory);
        notify(t('notify.ready'));
        return;
    }
    var reason = (result.evidence && result.evidence.message) ||
                 (result.collectionErrors || []).join('; ') || result.status;
    logLine('Siri AI не подтвердилась (' + result.status + '): ' + reason +
            '. Язык всё равно возвращён. ' + directory);
    notify(t('notify.notReady'));
}

// --- ручные операции --------------------------------------------------------

// Аварийно возвращает исходный язык из последней операции (в любой загрузке).
function restoreLanguage() {
    var tx = transaction();
    if (!tx || !tx.original) {
        throw new Error(t('error.neverRun'));
    }
    var changed = !samePrefs(prefs(), tx.original);
    if (changed) writePrefs(tx.original);
    removePath(statePath(PENDING_FILE));
    if (tx.phase !== 'completed') writeJSON(statePath(TX_FILE), archiveTx(tx, 'restored-manually'));
    finishRelaunch(false);
    if (changed) UI_NAMES.forEach(killByName);
    return { changed: changed, languages: tx.original.AppleLanguages || [] };
}

// Первая настройка: из английской сессии, когда Siri AI уже пришла, вернуть свой
// язык без перезагрузки. Дальше перезагружаться только через AI Restart.
function switchTarget() {
    var saved = savedTarget();
    if (!saved) throw new Error(t('error.noTarget'));
    if (!isEnglish(prefs())) return { already: true };
    var switchedAt = now();
    writePrefs(saved);
    sleep(1);
    restartSiri();
    try {
        restartInterface(switchedAt);
    } catch (error) {
        logLine('Перезапуск интерфейса не удался: ' + error.message);
    }
    notify(t('notify.restored'));
    return { already: false, languages: saved.AppleLanguages || [] };
}

function chatgptSelected() {
    var r = exec('/usr/bin/defaults',
                 ['read', 'com.apple.generativepartnerservicesettings', 'selectedLLMId']);
    return r.out.trim() === CHATGPT_ID;
}

// Пока язык ещё английский: ChatGPT доступен только при английском языке системы,
// поэтому включать расширение и входить в аккаунт нужно сейчас. После возврата
// своего языка ChatGPT продолжает работать, хотя настройки снова показывают «Войти…».
function chatgptSetup() {
    exec('/usr/bin/open', ['x-apple.systempreferences:com.apple.Siri-Settings.extension']);
    var done = t('chatgpt.done');
    var script = 'on run argv\n activate\n' +
        ' set r to display dialog (item 1 of argv) with title "' + APP_NAME + '" ' +
        'buttons {"' + t('chatgpt.skip') + '", "' + done + '"} default button "' + done + '" ' +
        'giving up after ' + CHATGPT_WAIT + '\n' +
        ' if gave up of r then return "timeout"\n return button returned of r\nend run';
    var answer = exec('/usr/bin/osascript', ['-e', script, t('chatgpt.setup')]).out.trim();
    var selected = chatgptSelected();
    logLine('CHATGPT ответ=' + (answer || 'ошибка') + ' выбран=' + selected);
    if (answer === done && !selected) notify(t('chatgpt.notEnabled'));
}

// Оставляет только последние запуски проверки Siri, чтобы папка не росла.
function pruneDiagnostics() {
    var directory = statePath('diagnostics');
    listDir(directory).sort().reverse().slice(KEEP_DIAGNOSTICS).forEach(function (name) {
        removePath(directory + '/' + name);
    });
    var transactions = statePath('transactions');
    listDir(transactions).map(function (name) {
        return { name: name, at: modifiedAt(transactions + '/' + name) };
    }).sort(function (a, b) { return b.at - a.at; }).slice(KEEP_TRANSACTIONS).forEach(function (item) {
        removePath(transactions + '/' + item.name);
    });
}

function status() {
    return {
        globals: prefs(),
        bootUUID: bootUUID(),
        transaction: transaction(),
        readiness: readJSON(statePath('last-readiness.json')),
        target: savedTarget()
    };
}
