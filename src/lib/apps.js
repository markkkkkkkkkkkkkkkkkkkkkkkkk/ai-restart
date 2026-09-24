// apps.js — приложения и интерфейс: что сейчас запущено, в каком порядке лежат окна,
// закрытие перед перезагрузкой и перезапуск интерфейса после смены языка.

// Их не трогаем: система сама вернёт им нужный язык, а Finder и Dock перезапускает UI_NAMES.
var KEEP_RUNNING = ['com.apple.loginwindow', 'com.apple.dock', 'com.apple.finder', 'com.apple.Spotlight',
    'com.apple.systemuiserver', 'com.apple.controlcenter', 'com.apple.notificationcenterui',
    'com.apple.siri', 'com.apple.campo', APP_BUNDLE_ID];
// ControlStrip — Touch Bar: без него подписи в нём остаются на английском.
var UI_NAMES = ['Spotlight', 'Finder', 'Dock', 'SystemUIServer', 'ControlCenter', 'NotificationCenter',
    'ControlStrip'];
// Вложенные бандлы: это не приложения пользователя, перезапускать их нельзя.
var NESTED_PARTS = ['.xpc', '.appex', '/Helpers/', '.app/Contents/Frameworks/'];

// PID владельцев окон в порядке, в котором их отдаёт CGWindowList.
// onScreenOnly=true — только текущий рабочий стол, спереди назад (для порядка окон).
// onScreenOnly=false — вообще все окна, включая другие рабочие столы и свёрнутые
// (для ответа на вопрос «есть ли у приложения окно»).
function windowOwners(onScreenOnly) {
    var options = $.kCGWindowListExcludeDesktopElements;
    if (onScreenOnly) options = options | $.kCGWindowListOptionOnScreenOnly;
    var list = ObjC.castRefToObject($.CGWindowListCopyWindowInfo(options, 0));
    var order = {};
    for (var i = 0; i < list.count; i++) {
        var window = list.objectAtIndex(i);
        if (Number(ObjC.unwrap(window.objectForKey('kCGWindowLayer'))) !== 0) continue;
        // Окна ниже 50 точек — подсказки и служебные панельки, а не окна приложения.
        var bounds = ObjC.deepUnwrap(window.objectForKey('kCGWindowBounds'));
        if (!bounds || Number(bounds.Height) < 50) continue;
        var pid = Number(ObjC.unwrap(window.objectForKey('kCGWindowOwnerPID')));
        if (!(pid in order)) order[pid] = i;
    }
    return order;
}

// Порядок окон на экране: первое вхождение процесса — его самое переднее окно.
function frontToBackOrder() {
    return windowOwners(true);
}

// Все приложения текущего пользователя, включая фоновые агенты с иконкой в меню.
// policy: 0 — обычное приложение, 1 — агент интерфейса, 2 — без интерфейса (пропускаем).
function guiApps() {
    var running = $.NSWorkspace.sharedWorkspace.runningApplications;
    var result = [];
    for (var i = 0; i < running.count; i++) {
        var item = running.objectAtIndex(i);
        var policy = Number(item.activationPolicy);
        if (policy !== 0 && policy !== 1) continue;
        if (item.bundleURL.isNil()) continue;
        result.push({
            pid: Number(item.processIdentifier),
            bundleID: item.bundleIdentifier.isNil() ? '' : ObjC.unwrap(item.bundleIdentifier),
            path: ObjC.unwrap(item.bundleURL.path),
            name: item.localizedName.isNil() ? '' : ObjC.unwrap(item.localizedName),
            agent: policy === 1,
            hidden: item.hidden,
            app: item
        });
    }
    return result;
}

// Время запуска процессов одним вызовом. etime («[[дд-]чч:]мм:сс») не зависит от
// языка системы, в отличие от lstart — на русской локали тот ломал разбор.
function startTimes() {
    var out = exec('/bin/ps', ['-axo', 'pid=,etime=']).out;
    var moment = now();
    var times = {};
    out.split('\n').forEach(function (line) {
        var parts = line.trim().split(/\s+/);
        if (parts.length < 2) return;
        var days = 0, clock = parts[1];
        if (clock.indexOf('-') !== -1) {
            days = Number(clock.split('-')[0]);
            clock = clock.split('-')[1];
        }
        var units = clock.split(':').map(Number);
        while (units.length < 3) units.unshift(0);
        var seconds = days * 86400 + units[0] * 3600 + units[1] * 60 + units[2];
        if (!isNaN(seconds)) times[Number(parts[0])] = moment - seconds;
    });
    return times;
}

// --- кнопка: что закрыть перед перезагрузкой --------------------------------

// Обычные приложения с окнами: закрываем их сами, иначе macOS переоткроет их ещё
// на английском. Список отдаётся СЗАДИ НАПЕРЁД: вход открывает приложения по
// очереди, и то, что было впереди, открывается последним и снова оказывается сверху.
function appsToReopen() {
    var skip = ['com.apple.finder', APP_BUNDLE_ID];
    var order = frontToBackOrder();
    var windowed = [], windowless = [];
    guiApps().forEach(function (item) {
        if (item.agent) return;
        if (skip.indexOf(item.bundleID) !== -1) return;
        if (/\/Siri AI\.app$/.test(item.path)) return; // её перезапускает вход
        if (item.pid in order) { item.z = order[item.pid]; windowed.push(item); } else windowless.push(item);
    });
    windowed.sort(function (a, b) { return b.z - a.z; });
    return windowless.concat(windowed);
}

// Мягко закрывает приложения; возвращает имена тех, что не закрылись
// (например, ждут сохранения документа).
function quitApps(apps) {
    apps.forEach(function (item) { item.app.terminate; });
    var alive = apps.slice();
    for (var waited = 0; waited < 40 && alive.length; waited++) {
        sleep(0.5);
        alive = alive.filter(function (item) {
            return exec('/bin/ps', ['-p', String(item.pid), '-o', 'pid=']).out.trim() !== '';
        });
    }
    return alive.map(function (item) { return item.name; });
}

// --- вход: перезапуск интерфейса на новом языке -----------------------------

function readQuitKeepsWindows() {
    var r = exec('/usr/bin/defaults', ['read', '-g', 'NSQuitAlwaysKeepsWindows']);
    return r.code === 0 ? r.out.trim() : null;
}

function writeQuitKeepsWindows(value) {
    if (value === null) exec('/usr/bin/defaults', ['delete', '-g', 'NSQuitAlwaysKeepsWindows']);
    else exec('/usr/bin/defaults', ['write', '-g', 'NSQuitAlwaysKeepsWindows', '-bool',
        (value === '1' || value === 'true' || value === 'YES') ? 'true' : 'false']);
}

// PID приложений, у которых вообще есть окно — включая другие рабочие столы и
// свёрнутые. Именно по этому списку решается, открывать приложение скрытым или нет.
// null — если список не получить.
function windowedPids() {
    try {
        return Object.keys(windowOwners(false)).map(Number);
    } catch (error) {
        logLine('Не удалось получить список окон: ' + error.message);
        return null;
    }
}

// Siri AI должна подняться уже на новом языке. Просто убиваем: у com.apple.campo
// в LaunchAgents стоит KeepAlive/SuccessfulExit=false, и launchd поднимает её сам
// за секунду и без окна. Открывать её через `open` нельзя: LaunchServices считает
// это «пользователь вызвал Siri» и показывает окно, которое само не закрывается.
function restartSiri() {
    killByName('Siri AI');
    sleep(1.5);
}

// Перезапускает видимые процессы, которые стартовали до переключения языка.
// Системные агенты launchd поднимет сам; остальные мягко закрываются и открываются
// заново: с окнами — с теми же окнами, без окон — скрыто, чтобы не выскакивали пустые окна.
function restartInterface(moment) {
    UI_NAMES.forEach(killByName);
    var windowed = windowedPids();
    var times = startTimes();
    var before = readQuitKeepsWindows();
    // На время перезапуска приложения сохраняют окна при выходе, как при галочке.
    exec('/usr/bin/defaults', ['write', '-g', 'NSQuitAlwaysKeepsWindows', '-bool', 'true']);
    try {
        restartInterfaceBody(moment, windowed, times);
    } finally {
        writeQuitKeepsWindows(before);
    }
}

function restartInterfaceBody(moment, windowed, times) {
    var reopen = [], terminated = [];
    guiApps().forEach(function (item) {
        var path = item.path;
        if (KEEP_RUNNING.indexOf(item.bundleID) !== -1) return;
        if (path.indexOf('Siri') !== -1 || path.indexOf('Campo') !== -1) return;
        if (NESTED_PARTS.some(function (part) { return path.indexOf(part) !== -1; })) return;
        if (!(item.pid in times) || times[item.pid] >= moment) return;
        var systemAgent = path.indexOf('/System/') === 0 && item.agent;
        if (systemAgent) {
            killPid(item.pid, 15);
            terminated.push(item);
            logLine('RESTART system ' + (item.bundleID || path));
            return;
        }
        item.app.terminate;
        item.reopenHidden = item.agent || (windowed !== null && windowed.indexOf(item.pid) === -1);
        reopen.push(item);
    });
    // Часть агентов (CoreServicesUIAgent — окна Gatekeeper, BackgroundTaskManagementAgent)
    // игнорирует SIGTERM и остаётся на английском; SIP не даёт launchctl kickstart,
    // поэтому добиваем SIGKILL — launchd поднимет их заново уже на новом языке.
    sleep(2);
    terminated.forEach(function (item) {
        if (exec('/bin/ps', ['-p', String(item.pid), '-o', 'pid=']).out.trim() === '') return;
        killPid(item.pid, 9);
        logLine('KILL (не реагирует на SIGTERM) ' + (item.bundleID || item.path));
    });
    var deadline = now() + 10;
    reopen.forEach(function (item) {
        while (now() < deadline &&
               exec('/bin/ps', ['-p', String(item.pid), '-o', 'pid=']).out.trim() !== '') sleep(0.3);
        if (exec('/bin/ps', ['-p', String(item.pid), '-o', 'pid=']).out.trim() !== '') {
            logLine('НЕ ЗАКРЫЛОСЬ ' + item.path);
            return;
        }
        openApp(item.path, item.reopenHidden, item.bundleID);
        logLine('REOPEN' + (item.reopenHidden ? ' hidden' : '') + ' ' + item.path);
    });
}

// Safari сам решает, восстанавливать ли прошлую сессию, и обычный запуск для него
// не считается восстановлением. Ключ ниже просит восстановить окна именно при этом
// запуске: аргументы командной строки читаются как настройки с наивысшим
// приоритетом и на диск не пишутся — своя настройка человека не меняется.
var RESTORE_ARGS = {
    'com.apple.Safari': ['-AlwaysRestoreSessionAtLaunch', 'YES']
};

function openApp(path, hidden, bundleID) {
    var args = ['-g'];
    if (hidden) args.push('-j');
    var restore = RESTORE_ARGS[bundleID || ''];
    if (restore) args = args.concat(['-a', path, '--args'], restore);
    else args.push(path);
    exec('/usr/bin/open', args);
}
