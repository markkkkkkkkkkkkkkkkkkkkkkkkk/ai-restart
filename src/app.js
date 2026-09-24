// app.js — само приложение. Компилируется в бандл (Scripts/main.scpt) и живёт в
// строке меню: значок со своим меню, как у системных. Оно же запускается агентом
// при входе в систему — тогда возврат языка выполняет отдельный дочерний процесс,
// чтобы меню оставалось живым, пока идёт ожидание Siri AI.

ObjC.import('Foundation');

var APP_PATH = ObjC.unwrap($.NSBundle.mainBundle.bundlePath);
['core', 'prefs', 'i18n', 'apps', 'readiness', 'flow', 'setup', 'glyph', 'dialogs', 'battery'].forEach(function (name) {
    var path = APP_PATH + '/Contents/Resources/lib/' + name + '.js';
    var source = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null);
    // Переводов здесь ещё нет — сообщение на двух языках сразу.
    if (source.isNil()) throw new Error('Повреждён бандл / damaged bundle: ' + name + '.js');
    (0, eval)(ObjC.unwrap(source));
});

// Ссылки держим в глобальных: иначе сборщик мусора уберёт значок и меню.
var statusItem = null, menuTarget = null, loginWorker = null;

var ACTION_RESTART = 1, ACTION_SHUTDOWN = 2, ACTION_CHATGPT = 3, ACTION_LANGUAGE = 4,
    ACTION_GUIDE = 5, ACTION_SETUP = 6, ACTION_UNINSTALL = 7, ACTION_QUIT = 8,
    ACTION_BATTERY = 9, ACTION_BATTERY_SETTINGS = 10, ACTION_BATTERY_MAIN = 11,
    ACTION_STYLE_MODERN = 12, ACTION_STYLE_CLASSIC = 13;
// Порог низкого заряда передаём тегом: 100 + проценты.
var ACTION_LOW_BASE = 100;
// Язык интерфейса: тег — это место языка в UI_CHOICES.
var ACTION_UI_BASE = 200;

// --- действия ---------------------------------------------------------------

// Закрывает приложения, ставит английский и уходит в перезагрузку или выключение.
function performRestart(choice) {
    var apps = appsToReopen();
    withLock(function () { arm(choice.reopen, apps); });
    try {
        // Окна сохраняются при закрытии, только если так задано глобально;
        // вход вернёт прежнее значение после открытия приложений.
        if (choice.reopen) {
            exec('/usr/bin/defaults', ['write', '-g', 'NSQuitAlwaysKeepsWindows', '-bool', 'true']);
        }
        var stuck = quitApps(apps);
        if (stuck.length) {
            throw new Error(t('error.stuckApps', { apps: stuck.join(', ') }));
        }
        withLock(function () { prepare(choice.chatgpt); });
    } catch (error) {
        try { withLock(function () { finishRelaunch(false); }); } catch (ignored) { /* уже снято */ }
        throw error;
    }
    leaveSession(choice.shutdown);
}

// shutdown: true — окно выключения, false — перезагрузки. ChatGPT идёт своим окном.
function actionLeave(shutdown, withChatGPT) {
    if (languageState().state === 'english') { actionLanguage(); return; }
    var choice = withChatGPT ? confirmChatGPT() : askLeave(shutdown);
    if (choice === null) return;
    performRestart(choice);
}

function actionLanguage() {
    var state = languageState();
    if (state.state !== 'english') {
        simpleAlert(t('language.alreadyTitle'), t('language.alreadyBody'), [t('common.ok')]);
        return;
    }
    englishMode(state.target);
}

// Процент заряда рядом с батарейкой. Системное число внутри значка при этом
// выключается: два процента подряд в строке меню никому не нужны.
function actionBattery() {
    if (batteryShown()) {
        disableBattery();
        refreshMenuBar();
        return;
    }
    if (!powerNow()) {
        simpleAlert(t('battery.noneTitle'), t('battery.noneBody'), [t('common.ok')]);
        return;
    }
    if (!simpleAlert(t('battery.enableTitle'), t('battery.enableBody'),
            [t('battery.enableButton'), t('common.cancel')])) return;
    enableBattery();
    refreshMenuBar();
}

function actionUninstall() {
    if (!simpleAlert(t('uninstall.title'), t('uninstall.body'),
            [t('uninstall.button'), t('common.cancel')])) return;
    withLock(uninstall);
    simpleAlert(t('uninstall.doneTitle'), t('uninstall.doneBody'), [t('common.ok')]);
    $.NSApplication.sharedApplication.terminate(null);
}

function handleAction(tag) {
    try {
        if (tag === ACTION_RESTART) actionLeave(false, false);
        else if (tag === ACTION_SHUTDOWN) actionLeave(true, false);
        else if (tag === ACTION_CHATGPT) actionLeave(false, true);
        else if (tag === ACTION_LANGUAGE) actionLanguage();
        else if (tag === ACTION_GUIDE) {
            exec('/usr/bin/open', [APP_PATH + '/Contents/Resources/' + t('guide.file')]);
        }
        else if (tag === ACTION_SETUP) firstSetupGuide();
        else if (tag === ACTION_BATTERY) actionBattery();
        else if (tag === ACTION_BATTERY_MAIN) {
            setBatteryAsMain(!batteryAsMain());
            refreshMenuBar();
        }
        else if (tag >= ACTION_UI_BASE) {
            setUILanguage(UI_CHOICES[tag - ACTION_UI_BASE].code);
            refreshMenuBar();
        }
        else if (tag > ACTION_LOW_BASE) {
            setLowThreshold(tag - ACTION_LOW_BASE);
            updateBattery(true);
        }
        else if (tag === ACTION_STYLE_MODERN || tag === ACTION_STYLE_CLASSIC) {
            setBatteryStyle(tag === ACTION_STYLE_CLASSIC ? 'classic' : 'modern');
            updateBattery(true);
        }
        else if (tag === ACTION_BATTERY_SETTINGS) {
            exec('/usr/bin/open', ['x-apple.systempreferences:com.apple.Battery-Settings.extension']);
        }
        else if (tag === ACTION_UNINSTALL) actionUninstall();
        else if (tag === ACTION_QUIT) $.NSApplication.sharedApplication.terminate(null);
    } catch (error) {
        simpleAlert(t('error.title'), String(error.message || error), [t('common.ok')]);
    }
}

// --- меню -------------------------------------------------------------------

// Пункт-подпись: без действия, но не погашенный — серый текст в меню читается
// плохо, а это строки, ради которых меню и открывают.
function infoItem(text) {
    return $.NSMenuItem.alloc.initWithTitleActionKeyEquivalent(text, $(), '');
}

// Пункт со значком программы. Просто задать пункту image нельзя: в собранном
// приложении (а это скомпилированный аплет) AppKit картинку у пункта меню не
// рисует — проверено на голом примере, тем же кодом обычный скрипт её рисует,
// а он же, собранный в .app, нет. Зато свой вид внутри пункта рисуется всегда,
// поэтому строку собираем из картинки и подписи сами.
// Высота строки снята с подсветки системного пункта: 48 px на ретине, то есть
// 24 pt. Свой вид AppKit сдвигает вправо на 4 pt относительно текста обычных
// пунктов, поэтому значок ставим на 17, чтобы он встал ровно туда, где у
// соседних строк начинается текст.
var MENU_ROW_H = 24, MENU_ROW_ICON = 16, MENU_ROW_ICON_X = 17, MENU_ROW_TEXT_X = 39;

function iconItem(icon, text) {
    var item = infoItem('');
    var font = $.NSFont.menuFontOfSize(0);
    var width = Math.ceil(Number($(text).sizeWithAttributes(
        $.NSDictionary.dictionaryWithObjectForKey(font, $.NSFontAttributeName)).width));
    var view = $.NSView.alloc.initWithFrame(
        $.NSMakeRect(0, 0, MENU_ROW_TEXT_X + width + 12, MENU_ROW_H));
    var picture = $.NSImageView.alloc.initWithFrame($.NSMakeRect(MENU_ROW_ICON_X,
        (MENU_ROW_H - MENU_ROW_ICON) / 2, MENU_ROW_ICON, MENU_ROW_ICON));
    picture.image = icon;
    view.addSubview(picture);
    var label = $.NSTextField.labelWithString(text);
    label.font = font;
    label.sizeToFit;
    // Подпись и значок ставим по одной середине: иначе значок кажется съехавшим.
    var height = Number(label.frame.size.height);
    label.frame = $.NSMakeRect(MENU_ROW_TEXT_X, (MENU_ROW_H - height) / 2,
        Number(label.frame.size.width), height);
    view.addSubview(label);
    item.view = view;
    return item;
}

// key — буква сочетания с ⌘. Оно срабатывает, только пока меню открыто: своих
// глобальных сочетаний у программы нет.
function actionItem(title, tag, key) {
    var item = $.NSMenuItem.alloc.initWithTitleActionKeyEquivalent(title, 'pick:', key || '');
    item.target = menuTarget;
    item.tag = tag;
    return item;
}

// Меню с выключенной автоматической доступностью пунктов. С включённой (так по
// умолчанию) AppKit сам решает, какой пункт погасить, и гасит всё, у чего нет
// действия — в том числе «Настройки», у которого вместо действия подменю.
function newMenu() {
    var menu = $.NSMenu.alloc.init;
    menu.autoenablesItems = false;
    return menu;
}

function submenuItem(title, submenu) {
    var item = $.NSMenuItem.alloc.initWithTitleActionKeyEquivalent(title, $(), '');
    item.submenu = submenu;
    return item;
}

// «Настройки» — всё, что делается редко и один раз.
function settingsMenu() {
    var menu = newMenu();
    menu.addItem(actionItem(t('menu.setup'), ACTION_SETUP));
    var battery = actionItem(t('menu.battery'), ACTION_BATTERY);
    // Галочка слева, как у переключателей в системных меню.
    battery.state = batteryShown() ? 1 : 0;
    menu.addItem(battery);
    if (batteryShown()) {
        var asMain = actionItem(t('menu.batteryAsMain'), ACTION_BATTERY_MAIN);
        asMain.state = batteryAsMain() ? 1 : 0;
        menu.addItem(asMain);
        menu.addItem(submenuItem(t('menu.style'), styleMenu()));
        menu.addItem(submenuItem(t('menu.lowLevel'), lowLevelMenu()));
    }
    menu.addItem(submenuItem(t('menu.uiLanguage'), uiLanguageMenu()));
    menu.addItem($.NSMenuItem.separatorItem);
    menu.addItem(actionItem(t('menu.uninstall'), ACTION_UNINSTALL));
    return menu;
}

// С какого процента значок краснеет и приходит предупреждение. Системное
// приходит ровно на десяти процентах, поэтому столько же стоит по умолчанию.
function lowLevelMenu() {
    var menu = newMenu();
    var current = lowThreshold();
    LOW_LEVELS.forEach(function (level) {
        var item = actionItem(level + '\u00a0%', ACTION_LOW_BASE + level);
        item.state = (level === current) ? 1 : 0;
        menu.addItem(item);
    });
    return menu;
}

// Язык интерфейса. По умолчанию берётся из языка возврата, но человеку может
// понадобиться другой: например, англоязычное меню на русской системе.
function uiLanguageMenu() {
    var menu = newMenu();
    var current = savedUILanguage();
    UI_CHOICES.forEach(function (choice, index) {
        var item = actionItem(choice.name || t('menu.uiAuto'), ACTION_UI_BASE + index);
        item.state = (choice.code === current) ? 1 : 0;
        menu.addItem(item);
        // Автовыбор отделяем от самих языков: это не язык, а правило.
        if (choice.code === 'auto') menu.addItem($.NSMenuItem.separatorItem);
    });
    return menu;
}

// Два вида значка: заливка, как в macOS 27, и обводка, как было до неё.
// Размер и место числа у них одинаковые, меняется только рисунок.
function styleMenu() {
    var menu = newMenu();
    var classic = batteryStyle() === 'classic';
    var modernItem = actionItem(t('menu.styleModern'), ACTION_STYLE_MODERN);
    modernItem.state = classic ? 0 : 1;
    var classicItem = actionItem(t('menu.styleClassic'), ACTION_STYLE_CLASSIC);
    classicItem.state = classic ? 1 : 0;
    menu.addItem(modernItem);
    menu.addItem(classicItem);
    return menu;
}

// У индикатора заряда своё меню: то же, что показывала системная батарейка —
// сколько осталось и куда нажать за настройками.
function batteryMenu() {
    var menu = newMenu();
    menu.delegate = menuTarget;
    menu.title = BATTERY_MENU;
    buildBatteryMenu(menu);
    return menu;
}

function buildBatteryMenu(menu) {
    menu.removeAllItems;
    menu.autoenablesItems = false;
    addBatteryItems(menu);
    menu.addItem($.NSMenuItem.separatorItem);
    menu.addItem(actionItem(t('menu.batteryOff'), ACTION_BATTERY));
}

// Всё то же, что показывала системная батарейка: сколько осталось, ёмкость
// и кто грузит машину. Режим энергосбережения включается только
// в настройках: pmset меняет его исключительно от имени администратора.
// Когда меню открывает значок процента, заряд уже стоит первой строкой снаружи —
// повторять его в подменю незачем (skipCharge).
function addBatteryItems(menu, skipCharge) {
    var info = null, health = null;
    if (!skipCharge) {
        try { info = batteryInfo(); } catch (error) { /* ниже покажем, что не знаем */ }
    }
    try { health = batteryHealth(); } catch (error) { /* без ёмкости обойдёмся */ }

    if (!skipCharge) menu.addItem(infoItem(info ? batteryLine(info) : t('menu.chargeUnknown')));
    if (health && health.capacity) {
        menu.addItem(infoItem(t('menu.capacity',
            { capacity: health.capacity, cycles: health.cycles })));
    }
    try { addEnergySection(menu); } catch (error) { /* без списка обойдёмся */ }
    if (Number(menu.numberOfItems)) menu.addItem($.NSMenuItem.separatorItem);
    menu.addItem(actionItem(t('menu.batterySettings'), ACTION_BATTERY_SETTINGS));
}

// --- кто тратит заряд -------------------------------------------------------

// Замер идёт полторы секунды (см. battery.js), поэтому меню открывается сразу,
// а раздел дописывается в него, когда замер готов. Пока меню открыто, обычные
// таймеры стоят — свой ставим во все режимы цикла событий.
var ENERGY_CHECK = 0.2;
var energyMenu = null, energyIndex = 0, energyTimer = null, energyWatch = null;

ObjC.registerSubclass({
    name: 'AIRestartEnergyWatch',
    methods: {
        'tick:': {
            types: ['void', ['id']],
            implementation: function () {
                if (!finishEnergySample()) return;
                energyTimer.invalidate;
                energyTimer = null;
                if (energyMenu) insertEnergyRows(energyMenu, energyIndex);
                energyMenu = null;
            }
        }
    }
});

function addEnergySection(menu) {
    energyMenu = null;
    if (energyFresh()) { insertEnergyRows(menu, Number(menu.numberOfItems)); return; }
    energyMenu = menu;
    energyIndex = Number(menu.numberOfItems);
    startEnergySample();
    if (energyTimer) return;
    if (!energyWatch) energyWatch = $.AIRestartEnergyWatch.alloc.init;
    energyTimer = $.NSTimer.timerWithTimeIntervalTargetSelectorUserInfoRepeats(
        ENERGY_CHECK, energyWatch, 'tick:', $(), true);
    $.NSRunLoop.currentRunLoop.addTimerForMode(energyTimer, 'kCFRunLoopCommonModes');
}

// Без чисел: у системного меню их тоже нет, а «энергопотребление 68» само
// по себе ни о чём не говорит. Порядок — от самого прожорливого.
function insertEnergyRows(menu, index) {
    if (!energyApps || !energyApps.length) return;
    var rows = [infoItem(t('menu.busy'))].concat(energyApps.map(function (app) {
        if (app.icon) return iconItem(app.icon, app.name);
        var row = infoItem(app.name);
        row.indentationLevel = 1;
        return row;
    }));
    // Разделитель — со стороны соседних пунктов.
    if (index > 0) rows.unshift($.NSMenuItem.separatorItem);
    else rows.push($.NSMenuItem.separatorItem);
    rows.forEach(function (row, i) { menu.insertItemAtIndex(row, index + i); });
}

// Меню собирается заново при каждом открытии: состав зависит от того, на каком
// языке система, подключён ли ChatGPT и пройдена ли первая настройка.
function buildMenu(menu) {
    menu.removeAllItems;
    menu.autoenablesItems = false;
    // Когда меню открывает значок процента, заряд показываем первой строкой:
    // своего меню у батареи в этом случае нет.
    try {
        if (batteryShown() && batteryAsMain()) {
            var charge = batteryInfo();
            if (charge) {
                menu.addItem(infoItem(batteryLine(charge)));
                var details = newMenu();
                addBatteryItems(details, true);
                menu.addItem(submenuItem(t('menu.batteryDetails'), details));
                menu.addItem($.NSMenuItem.separatorItem);
            }
        }
    } catch (error) { /* меню должно открыться в любом случае */ }
    var english = false;
    try {
        english = languageState().state === 'english';
    } catch (error) { /* меню должно открыться в любом случае */ }

    if (english) {
        menu.addItem(actionItem(t('menu.language'), ACTION_LANGUAGE, 'r'));
    } else {
        menu.addItem(actionItem(t('menu.restart'), ACTION_RESTART, 'r'));
        menu.addItem(actionItem(t('menu.shutdown'), ACTION_SHUTDOWN, 'q'));
        try {
            if (!chatgptSelected()) menu.addItem(actionItem(t('menu.chatgpt'), ACTION_CHATGPT));
        } catch (error) { /* не смогли прочитать — просто не показываем пункт */ }
    }
    menu.addItem($.NSMenuItem.separatorItem);
    // Пока Apple Intelligence до этого Mac не дошла, первая настройка — главное,
    // что человеку нужно. Когда дошла, пункт остаётся только в «Настройках».
    try {
        if (!setupDone()) menu.addItem(actionItem(t('menu.setup'), ACTION_SETUP));
    } catch (error) { /* не смогли проверить — пункт есть в «Настройках» */ }
    menu.addItem(submenuItem(t('menu.settings'), settingsMenu()));
    menu.addItem(actionItem(t('menu.guide'), ACTION_GUIDE));
    menu.addItem(actionItem(t('menu.quit'), ACTION_QUIT));
}

ObjC.registerSubclass({
    name: 'AIRestartMenuTarget',
    protocols: ['NSMenuDelegate'],
    methods: {
        'pick:': {
            types: ['void', ['id']],
            implementation: function (sender) { handleAction(Number(sender.tag)); }
        },
        'menuNeedsUpdate:': {
            types: ['void', ['id']],
            implementation: function (menu) {
                // Оба меню ведёт один делегат, различаем их по названию.
                if (ObjC.unwrap(menu.title) === BATTERY_MENU) buildBatteryMenu(menu);
                else buildMenu(menu);
            }
        }
    }
});

// Меню приложения: одно и то же, кто бы его ни открывал — свой значок или процент.
function mainMenu() {
    var menu = newMenu();
    menu.delegate = menuTarget;
    buildMenu(menu);
    return menu;
}

// Значок в строке меню — монохромный глиф: только так он совпадает по весу
// с системными значками и подхватывает цвет строки меню.
function installStatusItem() {
    if (statusItem) return;
    statusItem = $.NSStatusBar.systemStatusBar.statusItemWithLength(-1);
    // Позицию значка в строке меню задаёт пользователь: Cmd + перетащить. Без
    // autosaveName она сбрасывается при каждом запуске — отсюда и «значок всё время
    // куда-то девается». С ним macOS запоминает место навсегда. Программно поставить
    // значок правее системных (языка, паролей, Пункта управления) нельзя: у них своя
    // зона справа, туда сторонние приложения не пускают.
    statusItem.autosaveName = 'AIRestartStatusItem';
    statusItem.button.image = menuBarIcon(18);
    statusItem.button.toolTip = APP_NAME;
    statusItem.menu = mainMenu();
}

function removeStatusItem() {
    if (!statusItem) return;
    $.NSStatusBar.systemStatusBar.removeStatusItem(statusItem);
    statusItem = null;
}

// Собирает строку меню по настройкам: свой значок, значок процента или один
// значок процента, который открывает меню приложения.
function refreshMenuBar() {
    var merged = batteryShown() && batteryAsMain();
    if (merged) removeStatusItem(); else installStatusItem();
    installBatteryItem(merged ? mainMenu() : batteryMenu());
    // Совсем без значка приложение было бы не достать: если процент почему-то
    // не показался (например, Mac без аккумулятора), возвращаем свой значок.
    if (merged && !batteryItem) installStatusItem();
}

// --- возврат языка после входа ----------------------------------------------

// Тяжёлую работу (ожидание Siri AI до двух минут) делает отдельный процесс:
// иначе меню бы висело всё это время. Если возвращать нечего — он сразу выйдет.
function startLoginWorker() {
    if (!exists(statePath('pending'))) return;
    loginWorker = $.NSTask.alloc.init;
    loginWorker.launchPath = '/usr/bin/osascript';
    loginWorker.arguments = ['-l', 'JavaScript',
        APP_PATH + '/Contents/Resources/login.js', APP_PATH];
    loginWorker.standardOutput = $.NSFileHandle.fileHandleWithNullDevice;
    loginWorker.standardError = $.NSFileHandle.fileHandleWithNullDevice;
    loginWorker.standardInput = $.NSFileHandle.fileHandleWithNullDevice;
    try { loginWorker.launch; } catch (error) { logError('запуск возврата языка', String(error)); }
}

// --- запуск -----------------------------------------------------------------

function welcome() {
    simpleAlert(t('welcome.title'), t('welcome.body'), [t('common.ok')]);
}

// Агент запускает бандл напрямую, минуя LaunchServices, поэтому обычная защита
// от второго экземпляра не срабатывает: без этого в строке меню появляется два значка.
// Уступает тот, кто запустился позже (у него больше pid).
function anotherInstanceRunning() {
    var bundleID = $.NSBundle.mainBundle.bundleIdentifier;
    if (bundleID.isNil()) return false;
    var others = $.NSRunningApplication.runningApplicationsWithBundleIdentifier(bundleID);
    var mine = Number($.NSProcessInfo.processInfo.processIdentifier);
    for (var i = 0; i < others.count; i++) {
        var pid = Number(others.objectAtIndex(i).processIdentifier);
        if (pid !== mine && pid < mine) return true;
    }
    return false;
}

function run() {
    if (anotherInstanceRunning()) return;
    var firstRun = false;
    try {
        firstRun = ensureInstalled(APP_PATH);
    } catch (error) {
        simpleAlert(t('error.installTitle'), String(error.message || error), [t('common.ok')]);
        return;
    }
    menuTarget = $.AIRestartMenuTarget.alloc.init;
    refreshMenuBar();
    startLoginWorker();
    if (firstRun) welcome();
    // Дальше всё живёт на событиях меню; сюда управление уже не вернётся.
    $.NSApplication.sharedApplication.run;
}

// Повторный запуск из Spotlight или Dock, когда приложение уже работает:
// открываем главное окно, иначе кажется, что ничего не произошло.
function reopen() {
    handleAction(languageState().state === 'english' ? ACTION_LANGUAGE : ACTION_RESTART);
}
