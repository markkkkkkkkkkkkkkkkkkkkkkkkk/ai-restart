// dialogs.js — все окна приложения. Главное окно повторяет системное окно
// перезагрузки loginwindow: те же русские строки, тот же отсчёт 60 секунд, та же
// галочка. Логики здесь нет — только показать и вернуть ответ.

var COUNTDOWN = 60;

// Русские строки взяты из loginwindow.loctable, чтобы окна совпадали с системными
// дословно: USER_RESTART_MSG / USER_POWER_BUTTON_MSG и WILL_RESTART_INFO /
// WILL_SHUTDOWN_INFO. Счёт секунд — в i18n.js, у языков разные формы числа.
function countdownText(n, shutdown) {
    return t(shutdown ? 'leave.shutdownCountdown' : 'leave.restartCountdown',
        { seconds: secondsText(n) });
}

// Таймер отсчёта: NSTimer с target-объектом работает и внутри runModal.
var countdownAlert = null, countdownLeft = 0, countdownShutdown = false;
ObjC.registerSubclass({
    name: 'AIRestartCountdown',
    methods: {
        'tick:': {
            types: ['void', ['id']],
            implementation: function (timer) {
                countdownLeft -= 1;
                if (countdownLeft <= 0) {
                    timer.invalidate;
                    $.NSApplication.sharedApplication.stopModalWithCode($.NSAlertFirstButtonReturn);
                    return;
                }
                countdownAlert.informativeText = countdownText(countdownLeft, countdownShutdown);
            }
        }
    }
});

// Иконка приложения по сетке macOS имеет прозрачные поля (плашка 824 из 1024), и в окне
// она выглядит мельче системной. Для окна вырезаем плашку без полей — как кружок
// в системном окне перезагрузки, иконка занимает всю отведённую область.
function alertIcon() {
    var path = $.NSBundle.mainBundle.pathForResourceOfType('applet', 'icns');
    if (path.isNil()) return null;
    var source = $.NSImage.alloc.initWithContentsOfFile(path);
    if (source.isNil()) return null;
    var side = 256, full = Number(source.size.width), inset = full * 100 / 1024;
    var icon = $.NSImage.alloc.initWithSize($.NSMakeSize(side, side));
    icon.lockFocus;
    source.drawInRectFromRectOperationFraction($.NSMakeRect(0, 0, side, side),
        $.NSMakeRect(inset, inset, full - 2 * inset, full - 2 * inset),
        $.NSCompositingOperationSourceOver, 1);
    icon.unlockFocus;
    return icon;
}

// Приложение помечено LSUIElement: без явной активации окно остаётся неактивным
// и кнопка «Перезагрузить» не подсвечивается синим.
function bringToFront() {
    var nsApp = $.NSApplication.sharedApplication;
    if (nsApp.respondsToSelector('activate')) nsApp.activate;
    nsApp.activateIgnoringOtherApps(true);
    $.NSRunningApplication.currentApplication.activateWithOptions($.NSApplicationActivateAllWindows);
}

function newAlert(title, text) {
    var alert = $.NSAlert.alloc.init;
    var icon = alertIcon();
    if (icon) alert.icon = icon;
    alert.messageText = title;
    alert.informativeText = text;
    return alert;
}

function showAlert(alert) {
    alert.layout;
    alert.window.level = $.NSModalPanelWindowLevel;
    alert.window.center;
    alert.window.makeKeyAndOrderFront($());
    bringToFront();
    // Мост ObjC отдаёт числа строками, поэтому сравнивать можно только через Number().
    return Number(alert.runModal);
}

function simpleAlert(title, text, buttons) {
    bringToFront();
    var alert = newAlert(title, text);
    buttons.forEach(function (name) { alert.addButtonWithTitle(name); });
    if (buttons.length > 1) alert.buttons.objectAtIndex(1).keyEquivalent = '\u001b';
    return showAlert(alert) === Number($.NSAlertFirstButtonReturn);
}

function languageName(code) {
    var locale = $.NSLocale.alloc.initWithLocaleIdentifier(code || 'ru');
    var name = locale.localizedStringForLanguageCode(code || 'ru');
    if (name.isNil()) return code;
    var text = ObjC.unwrap(name);
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Окно перезагрузки или выключения — по одному на действие, как в меню Apple:
// в каждом только своя кнопка, без выбора между двумя разными исходами.
// Возвращает null при отмене.
function askLeave(shutdown) {
    bringToFront();
    var alert = newAlert(t(shutdown ? 'leave.shutdownTitle' : 'leave.restartTitle'),
        countdownText(COUNTDOWN, shutdown));
    alert.addButtonWithTitle(t(shutdown ? 'leave.shutdownButton' : 'leave.restartButton'));
    alert.addButtonWithTitle(t('common.cancel')).keyEquivalent = '\u001b';
    alert.showsSuppressionButton = true;
    alert.suppressionButton.title = t('leave.reopen');
    alert.suppressionButton.state = readLogoutSavesState() ? 1 : 0;

    countdownAlert = alert;
    countdownLeft = COUNTDOWN;
    countdownShutdown = shutdown;
    var ticker = $.AIRestartCountdown.alloc.init;
    var timer = $.NSTimer.timerWithTimeIntervalTargetSelectorUserInfoRepeats(1, ticker, 'tick:', $(), true);
    $.NSRunLoop.currentRunLoop.addTimerForMode(timer, $.NSModalPanelRunLoopMode);
    var response = showAlert(alert);
    timer.invalidate;

    // Мост отдаёт числа строками, поэтому и ответ, и состояние галочки — через Number().
    if (response !== Number($.NSAlertFirstButtonReturn)) return null;
    return {
        reopen: Number(alert.suppressionButton.state) === 1,
        shutdown: shutdown,
        chatgpt: false
    };
}

// Подключение ChatGPT — отдельный пункт меню: та же перезагрузка, но с остановкой
// на английском, потому что войти в аккаунт можно только там.
function confirmChatGPT() {
    var ok = simpleAlert(t('chatgpt.title'), t('chatgpt.body'),
        [t('leave.restartButton'), t('common.cancel')]);
    return ok ? { reopen: readLogoutSavesState(), shutdown: false, chatgpt: true } : null;
}

// Первая настройка: система на английском, пока Apple Intelligence включает Siri AI.
// Тогда кнопка не перезагружает, а возвращает сохранённый язык — без перезагрузки.
function englishMode(target) {
    var ok = simpleAlert(t('language.title', { language: languageName(target) }),
        t('language.body'), [t('language.button'), t('common.cancel')]);
    if (!ok) return;
    var result = withLock(switchTarget);
    if (result.already) {
        simpleAlert(t('language.alreadyTitle'), t('language.alreadyBody'), [t('common.ok')]);
    }
}

// Перезагрузка или выключение. «state saving preference true» = следовать настройке
// TALLogoutSavesState, которую arm выставил в false. Без этого параметра loginwindow
// ВСЕГДА сохраняет список открытых приложений и открывает их при входе — даже со
// снятой галочкой. Сырое событие aevt/rest параметра не знает: в двоичном файле
// loginwindow кода 'stsv' нет, его понимает только System Events.
function leaveSession(shutdown) {
    var verb = shutdown ? 'shut down' : 'restart';
    var script = [
        'try',
        '  with timeout of 10 seconds',
        '    tell application "System Events" to ' + verb + ' state saving preference true',
        '  end timeout',
        '  return 0',
        'on error errorText number errorNumber',
        '  return errorNumber',
        'end try'
    ].join('\n');
    var result = $.NSAppleScript.alloc.initWithSource(script).executeAndReturnError(null);
    var code = result.isNil() ? -1 : Number(result.int32Value);
    // -1712: System Events не ответил вовремя, но перезагрузка уже идёт.
    if (code && code !== -1712) {
        $.NSAppleScript.alloc.initWithSource(
            'tell application "loginwindow" to «event aevt' + (shutdown ? 'shut' : 'rest') + '»'
        ).executeAndReturnError(null);
    }
}

// Первая настройка для тех, у кого Apple Intelligence ещё не включена. Порядок
// шагов важен: очередь Apple Intelligence открывается только на английской системе,
// и решается это при загрузке — поэтому первый шаг человек делает руками, обычной
// перезагрузкой, когда приложения ещё нет. Подсказки зависят от того, где он сейчас.
function firstSetupGuide() {
    var done = false;
    try { done = setupDone(); } catch (error) { /* не смогли проверить — ведём по шагам */ }
    if (done) {
        var toSiri = simpleAlert(t('setup.doneTitle'), t('setup.doneBody'),
            [t('setup.openAI'), t('common.ok')]);
        if (toSiri) exec('/usr/bin/open', ['x-apple.systempreferences:com.apple.Siri-Settings.extension']);
        return;
    }
    if (isEnglish(prefs())) {
        var toSettings = simpleAlert(t('setup.step2Title'), t('setup.step2Body'),
            [t('setup.openAI'), t('common.ok')]);
        if (toSettings) exec('/usr/bin/open', ['x-apple.systempreferences:com.apple.Siri-Settings.extension']);
        return;
    }
    var toLanguage = simpleAlert(t('setup.startTitle'), t('setup.startBody'),
        [t('setup.openLanguage'), t('common.ok')]);
    if (toLanguage) exec('/usr/bin/open', ['x-apple.systempreferences:com.apple.Localization-Settings.extension']);
}
