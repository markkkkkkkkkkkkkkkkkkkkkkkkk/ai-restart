// core.js — основа: запуск процессов, файлы, состояние, блокировка, уведомления.
// Подключается первым; всё остальное рассчитывает на эти функции.

ObjC.import('Foundation');
ObjC.import('AppKit');
ObjC.import('CoreGraphics');

var APP_NAME = 'AI Restart';
var APP_BUNDLE_ID = 'com.airestart.app';
var AGENT_LABEL = 'com.airestart';
var HOME = ObjC.unwrap($.NSHomeDirectory());
var STATE = HOME + '/Library/Application Support/AIRestart';
var KEEP_DIAGNOSTICS = 10;
var KEEP_TRANSACTIONS = 20;

// --- процессы ---------------------------------------------------------------

// Запуск без шелла: аргументы уходят как есть, экранирование не нужно.
// stderr читается после stdout — для наших команд он всегда короткий.
function exec(path, args) {
    var task = $.NSTask.alloc.init;
    task.launchPath = path;
    task.arguments = args || [];
    var out = $.NSPipe.pipe, err = $.NSPipe.pipe;
    task.standardOutput = out;
    task.standardError = err;
    task.standardInput = $.NSFileHandle.fileHandleWithNullDevice;
    try {
        task.launch;
    } catch (error) {
        return { code: -1, out: '', err: String(error) };
    }
    var o = out.fileHandleForReading.readDataToEndOfFile;
    var e = err.fileHandleForReading.readDataToEndOfFile;
    task.waitUntilExit;
    return { code: Number(task.terminationStatus), out: dataText(o), err: dataText(e) };
}

// Как exec, но ненулевой код — исключение.
function execOk(path, args) {
    var r = exec(path, args);
    if (r.code !== 0) {
        throw new Error(t('error.exit',
            { command: baseName(path), code: r.code, details: r.err.trim() }));
    }
    return r;
}

function dataText(data) {
    var s = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
    return s.isNil() ? '' : ObjC.unwrap(s);
}

function baseName(path) {
    return String(path).split('/').pop();
}

function sleep(seconds) {
    $.NSThread.sleepForTimeInterval(seconds);
}

function now() {
    return Date.now() / 1000;
}

function uuid() {
    return ObjC.unwrap($.NSUUID.UUID.UUIDString);
}

function bootUUID() {
    return execOk('/usr/sbin/sysctl', ['-n', 'kern.bootsessionuuid']).out.trim();
}

// Убить процесс сигналом; отсутствие процесса ошибкой не считается.
function killPid(pid, signal) {
    exec('/bin/kill', ['-' + (signal || 15), String(pid)]);
}

function killByName(name) {
    exec('/usr/bin/killall', ['-u', String(ObjC.unwrap($.NSUserName())), name]);
}

// --- файлы ------------------------------------------------------------------

function fileManager() {
    return $.NSFileManager.defaultManager;
}

function exists(path) {
    return fileManager().fileExistsAtPath(path);
}

function makeDir(path) {
    fileManager().createDirectoryAtPathWithIntermediateDirectoriesAttributesError(path, true, $(), null);
}

function removePath(path) {
    if (exists(path)) fileManager().removeItemAtPathError(path, null);
}

function listDir(path) {
    if (!exists(path)) return [];
    var items = fileManager().contentsOfDirectoryAtPathError(path, null);
    return items.isNil() ? [] : ObjC.deepUnwrap(items);
}

function modifiedAt(path) {
    var attrs = fileManager().attributesOfItemAtPathError(path, null);
    if (attrs.isNil()) return 0;
    var date = attrs.objectForKey($.NSFileModificationDate);
    return date.isNil() ? 0 : Number(date.timeIntervalSince1970);
}

function readText(path) {
    var s = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null);
    return s.isNil() ? null : ObjC.unwrap(s);
}

// atomically:true — запись через временный файл, как в старой версии на Python.
function writeText(path, text) {
    makeDir(parentDir(path));
    var ok = $(String(text)).writeToFileAtomicallyEncodingError(path, true, $.NSUTF8StringEncoding, null);
    if (!ok) throw new Error(t('error.write', { path: path }));
}

function parentDir(path) {
    var parts = String(path).split('/');
    parts.pop();
    return parts.join('/');
}

function appendText(path, text) {
    writeText(path, (readText(path) || '') + text);
}

function readJSON(path) {
    var raw = readText(path);
    if (raw === null) return null;
    try { return JSON.parse(raw); } catch (error) { return null; }
}

function writeJSON(path, value) {
    writeText(path, JSON.stringify(value, null, 2));
}

// --- состояние --------------------------------------------------------------

function statePath(name) {
    return STATE + '/' + name;
}

function logLine(text) {
    appendText(statePath('login.log'), text + '\n');
    console.log(text);
}

function logError(action, message) {
    var line = new Date().toISOString() + ' ' + action + ': ' + message;
    appendText(statePath('errors.log'), line + '\n');
    console.log(line);
}

// Блокировка: mkdir атомарен, поэтому создание каталога = захват замка.
// Замок старше часа считается брошенным (упало между созданием и снятием).
function withLock(body) {
    var lock = statePath('operation.lock.d');
    makeDir(STATE);
    if (exists(lock) && now() - modifiedAt(lock) > 3600) removePath(lock);
    var ok = fileManager().createDirectoryAtPathWithIntermediateDirectoriesAttributesError(lock, false, $(), null);
    if (!ok) throw new Error(t('error.busy'));
    try { return body(); } finally { removePath(lock); }
}

function notify(message) {
    var script = 'on run argv\n display notification (item 1 of argv) with title "' + APP_NAME + '"\nend run';
    exec('/usr/bin/osascript', ['-e', script, String(message)]);
}
