// setup.js — самоустановка. Приложение самодостаточно: вся логика лежит внутри
// бандла, наружу выносится только агент запуска при входе и папка состояния.

var AGENT_PLIST = HOME + '/Library/LaunchAgents/' + AGENT_LABEL + '.plist';
// Языки, на которые предлагаем возвращаться, если система стартовала английской.
// Список нужен ТОЛЬКО в этом случае: на неанглийской системе приложение само
// запоминает текущий язык, каким бы он ни был. Здесь — языки, которых нет среди
// поддерживаемых Apple Intelligence (на 2026 год): сначала соседи по региону,
// откуда пришли первые пользователи, дальше — по алфавиту кодов.
var TARGET_CHOICES = [
    { title: 'Русский', code: 'ru' },
    { title: 'Українська', code: 'uk' },
    { title: 'Беларуская', code: 'be' },
    { title: 'Қазақ тілі', code: 'kk' },
    { title: 'Oʻzbekcha', code: 'uz' },
    { title: 'Azərbaycan', code: 'az' },
    { title: 'Հայերեն', code: 'hy' },
    { title: 'ქართული', code: 'ka' },
    { title: 'Català', code: 'ca' },
    { title: 'Čeština', code: 'cs' },
    { title: 'Ελληνικά', code: 'el' },
    { title: 'Suomi', code: 'fi' },
    { title: 'עברית', code: 'he' },
    { title: 'Hrvatski', code: 'hr' },
    { title: 'Magyar', code: 'hu' },
    { title: 'Bahasa Indonesia', code: 'id' },
    { title: 'Bahasa Melayu', code: 'ms' },
    { title: 'Polski', code: 'pl' },
    { title: 'Română', code: 'ro' },
    { title: 'Slovenčina', code: 'sk' },
    { title: 'ไทย', code: 'th' }
];

// Агент запускает САМ бандл, а не /usr/bin/osascript: macOS подписывает фоновый
// элемент именем программы, и при osascript в «Элементах входа» висела строчка
// «osascript, неизвестный разработчик». Путь внутри бандла — имя будет «AI Restart».
function agentPlist(appPath) {
    var executable = appPath + '/Contents/MacOS/' + ObjC.unwrap(
        $.NSBundle.mainBundle.infoDictionary.objectForKey('CFBundleExecutable'));
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
        '<plist version="1.0">\n<dict>\n' +
        '    <key>Label</key>\n    <string>' + AGENT_LABEL + '</string>\n' +
        '    <key>ProgramArguments</key>\n    <array>\n' +
        '        <string>' + executable + '</string>\n' +
        '    </array>\n' +
        '    <key>RunAtLoad</key>\n    <true/>\n' +
        '    <key>LimitLoadToSessionType</key>\n    <string>Aqua</string>\n' +
        '</dict>\n</plist>\n';
}

// Агент переписывается, если приложение переехало: путь внутри plist должен
// указывать на текущее место бандла.
function installAgent(appPath) {
    var wanted = agentPlist(appPath);
    if (readText(AGENT_PLIST) === wanted) {
        var loaded = exec('/bin/launchctl', ['print', 'gui/' + userID() + '/' + AGENT_LABEL]);
        if (loaded.code === 0) return false;
    }
    makeDir(parentDir(AGENT_PLIST));
    writeText(AGENT_PLIST, wanted);
    exec('/bin/launchctl', ['bootout', 'gui/' + userID() + '/' + AGENT_LABEL]);
    var r = exec('/bin/launchctl', ['bootstrap', 'gui/' + userID(), AGENT_PLIST]);
    if (r.code !== 0) throw new Error(t('error.agent', { details: r.err.trim() }));
    return true;
}

function removeAgent() {
    exec('/bin/launchctl', ['bootout', 'gui/' + userID() + '/' + AGENT_LABEL]);
    removePath(AGENT_PLIST);
}

function userID() {
    return exec('/usr/bin/id', ['-u']).out.trim();
}

// Следы версии, которая ставилась установщиком из архива: сами скрипты лежали
// рядом с состоянием, а кнопок было две. Состояние (транзакции, логи, язык
// возврата) не трогаем — новая версия читает те же файлы.
// Агенты прошлых версий: до первого релиза у приложения был другой
// идентификатор. Ищем в LaunchAgents всё, что запускает наш бандл под чужой
// меткой, и снимаем — иначе при входе запускалось бы два экземпляра. Проверка
// общая, без списка имён: так же снимутся агенты любых будущих переименований.
function removeLegacyAgents() {
    var directory = HOME + '/Library/LaunchAgents';
    listDir(directory).forEach(function (name) {
        if (name === AGENT_LABEL + '.plist' || name.slice(-6) !== '.plist') return;
        var text = readText(directory + '/' + name);
        if (!text || text.indexOf('/' + APP_NAME + '.app/Contents/MacOS/') === -1) return;
        exec('/bin/launchctl', ['bootout', 'gui/' + userID() + '/' + name.slice(0, -6)]);
        removePath(directory + '/' + name);
    });
}

var LEGACY_PATHS = [
    STATE + '/bin',
    STATE + '/AI Restart.app',
    STATE + '/AI Restart.shortcut',
    STATE + '/shortcut-unsigned.shortcut',
    HOME + '/Applications/Подключить ChatGPT.app'
];

function removeLegacy() {
    removeLegacyAgents();
    var removed = [];
    LEGACY_PATHS.forEach(function (path) {
        if (!exists(path)) return;
        removePath(path);
        removed.push(baseName(path));
    });
    return removed;
}

// Запускается при каждом старте приложения: чинит агент и, если язык возврата ещё
// не выбран, спрашивает его. Возвращает true, если это была первая установка.
function ensureInstalled(appPath) {
    var firstRun = !exists(AGENT_PLIST) || exists(STATE + '/bin');
    installAgent(appPath);
    removeLegacy();
    if (!savedTarget() || !isEnglish(prefs())) {
        try {
            saveTarget(null);
        } catch (error) {
            askTargetLanguage();
        }
    }
    return firstRun;
}

// Система уже английская и язык возврата неизвестен — спрашиваем прямо в окне.
function askTargetLanguage() {
    var titles = TARGET_CHOICES.map(function (item) { return item.title; });
    var script = 'on run argv\n activate\n' +
        ' set r to choose from list argv with title "' + APP_NAME + '" ' +
        'with prompt "' + t('language.ask') + '" ' +
        'default items {item 1 of argv}\n' +
        ' if r is false then return ""\n return item 1 of r\nend run';
    var chosen = exec('/usr/bin/osascript', ['-e', script].concat(titles)).out.trim();
    var found = TARGET_CHOICES.filter(function (item) { return item.title === chosen; })[0];
    if (!found) throw new Error(t('error.noLanguageChosen'));
    saveTarget(found.code);
    return found;
}

// Полное удаление: вернуть язык, снять агент, стереть состояние.
// Сам бандл пользователь перетаскивает в Корзину сам.
function uninstall() {
    try { restoreLanguage(); } catch (error) { /* языка могло и не быть */ }
    removeLegacyAgents();
    // Системный процент заряда возвращаем на место, раз мы его выключали.
    try { disableBattery(); } catch (error) { /* значка могло и не быть */ }
    removeAgent();
    removePath(STATE);
}

// --- пройдена ли первая настройка -------------------------------------------

// «Первая настройка» делается один раз: дождаться, пока Apple Intelligence дойдёт
// до этого Mac. Два признака, оба читаются прямо из настроек подписочных функций:
//   • кэш ai.enhanced-siri с canUse = true — функция уже доступна аккаунту;
//   • список ожидания: запись про ai.enhanced-siri со статусом active.
// Оба — кэши и могут протухнуть, поэтому первый успех запоминаем меткой: пункт
// меню не должен то появляться, то исчезать.
var SETUP_DONE_FILE = 'setup-done';
var FEATURE_KEY = 'ai.enhanced-siri';
var SUBSCRIPTION_CACHE = 'com.apple.CloudSubscriptionFeatures.cache';
var SUBSCRIPTION_WAITLIST = 'com.apple.CloudSubscriptionFeatures.waitlist';

function dataJSON(data) {
    var text = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
    if (text.isNil()) return null;
    try { return JSON.parse(ObjC.unwrap(text)); } catch (error) { return null; }
}

function dataPlist(data) {
    var plist = $.NSPropertyListSerialization.propertyListWithDataOptionsFormatError(
        data, $.NSPropertyListImmutable, null, null);
    return plist.isNil() ? null : ObjC.deepUnwrap(plist);
}

function enhancedSiriGranted() {
    try {
        var cached = domainValue(SUBSCRIPTION_CACHE, FEATURE_KEY);
        var entry = cached ? dataPlist(cached) : null;
        if (entry && entry.value && entry.value.canUse) return true;
    } catch (error) { /* чужой кэш недоступен — считаем, что признака нет */ }
    try {
        var raw = domainValue(SUBSCRIPTION_WAITLIST, 'waitlistResults');
        var list = raw ? dataJSON(raw) : null;
        if (Array.isArray(list)) {
            return list.some(function (item) {
                var value = item && item.value;
                return !!value && value.status === 'active' &&
                    (value.featureIDs || []).indexOf(FEATURE_KEY) !== -1;
            });
        }
    } catch (error) { /* то же самое */ }
    return false;
}

function setupDone() {
    if (exists(statePath(SETUP_DONE_FILE))) return true;
    var readiness = readJSON(statePath('last-readiness.json'));
    if (!(readiness && readiness.status === 'ready') && !enhancedSiriGranted()) return false;
    try {
        writeText(statePath(SETUP_DONE_FILE), new Date().toISOString() + '\n');
    } catch (error) { /* метка — только для скорости, без неё проверим заново */ }
    return true;
}
