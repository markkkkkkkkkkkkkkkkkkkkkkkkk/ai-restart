// login.js — точка входа для агента запуска при входе в систему.
// Запускается так: osascript -l JavaScript login.js "/путь/AI Restart.app"

function run(argv) {
    var appPath = String(argv[0] || '');
    var lib = appPath + '/Contents/Resources/lib/';
    ObjC.import('Foundation');
    ObjC.import('AppKit');
    ObjC.import('CoreGraphics');
    ['core', 'prefs', 'i18n', 'apps', 'readiness', 'flow'].forEach(function (name) {
        var source = $.NSString.stringWithContentsOfFileEncodingError(
            lib + name + '.js', $.NSUTF8StringEncoding, null);
        if (source.isNil()) throw new Error('Не найден модуль ' + name + '.js рядом с приложением');
        (0, eval)(ObjC.unwrap(source));
    });

    logLine(new Date().toISOString() + ' ВХОД');
    try {
        withLock(login);
    } catch (error) {
        logError('вход', String(error.message || error));
    }
}
