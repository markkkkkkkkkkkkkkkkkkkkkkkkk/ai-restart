// readiness.js — проверка готовности Enhanced Siri по системному журналу.
// Ничего не меняет: только читает журнал и будит Siri AI, чтобы она записала своё состояние.
// Итог: ready | unavailable | unconfirmed | collection-error.

var READY_PREDICATE =
    '(process == "Siri" OR process == "Siri AI" OR process == "generativeexperiencesd") ' +
    'AND (eventMessage CONTAINS[c] "Enhanced Siri" ' +
    'OR eventMessage CONTAINS[c] "LanguageIsSupported" ' +
    'OR eventMessage CONTAINS[c] "selectedSiriLanguageIneligible" ' +
    'OR eventMessage CONTAINS[c] "isServiceAvailable")';
var STRONG = /Enhanced Siri (?:computed state|update applied): available=(true|false)\b|Enhanced Siri returning: (available|unavailable)\b/;
var READY_PROCESSES = ['Siri', 'Siri AI', 'generativeexperiencesd'];
var READY_TIMEOUT = 90;      // сколько ждать событие, прежде чем сдаться или повторить
var READY_SETTLE = 3;        // столько секунд «ready» должен продержаться
var HISTORY_EVERY = 15;      // как часто дочитывать журнал с начала загрузки

function Detector(boot) {
    this.boot = String(boot).toUpperCase();
    this.events = {};
}

Detector.prototype.add = function (line) {
    var event;
    try { event = JSON.parse(line); } catch (error) { return; }
    if (!event || typeof event !== 'object') return;
    if (String(event.bootUUID || '').toUpperCase() !== this.boot) return;
    var proc = String(event.processImagePath || '').split('/').pop();
    if (READY_PROCESSES.indexOf(proc) === -1) return;
    var stamp = Number(event.machTimestamp);
    if (!isFinite(stamp)) return;
    var message = String(event.eventMessage || '');
    var match = STRONG.exec(message);
    var kind = null;
    if (match) {
        kind = (match[1] === 'true' || match[2] === 'available') ? 'ready' : 'unavailable';
    } else if (message.indexOf('Missing Linwood desired capabilities: LanguageIsSupported') !== -1 ||
               (message.indexOf('Enhanced Siri') !== -1 && message.indexOf('selectedSiriLanguageIneligible') !== -1)) {
        kind = 'unavailable';
    } else if (message.indexOf('ChatInputViewModel.isServiceAvailable changed to true') !== -1) {
        kind = 'ui-only';
    }
    if (!kind) return;
    // Ключ склеивает время, процесс и текст: одно и то же событие приходит и из
    // потока, и из дочитки журнала, а считать его нужно один раз.
    this.events[[stamp, proc, message].join('\t')] = {
        machTimestamp: stamp, timestamp: event.timestamp || null,
        process: proc, kind: kind, message: message
    };
};

Detector.prototype.result = function () {
    var self = this;
    var events = Object.keys(this.events)
        .map(function (key) { return self.events[key]; })
        .sort(function (a, b) { return a.machTimestamp - b.machTimestamp; });
    // Флаг интерфейса — только подтверждение, сам по себе он ничего не доказывает.
    var strong = events.filter(function (e) { return e.kind !== 'ui-only'; });
    var last = strong.length ? strong[strong.length - 1] : null;
    return {
        status: last ? last.kind : 'unconfirmed',
        bootUUID: this.boot,
        evidence: last,
        recentEvents: events.slice(-20)
    };
};

// Журнал текущей загрузки целиком: ловит события, случившиеся до старта потока.
function readinessSnapshot(detector, output, errors) {
    var r = exec('/usr/bin/log', ['show', '--last', 'boot', '--style', 'ndjson', '--info',
                                  '--predicate', READY_PREDICATE]);
    if (r.code !== 0) { errors.push(r.err.trim()); return false; }
    appendText(output + '/history.ndjson', r.out);
    r.out.split('\n').forEach(function (line) { detector.add(line); });
    return true;
}

// Фоновый «log stream» пишет в файл, а мы дочитываем его по мере появления строк:
// потоков в JXA нет, поэтому очередь заменяется файлом.
function startReadinessStream(output) {
    var path = output + '/stream.ndjson';
    var errorsPath = output + '/stream-errors.txt';
    writeText(path, '');
    writeText(errorsPath, '');
    var task = $.NSTask.alloc.init;
    task.launchPath = '/usr/bin/log';
    task.arguments = ['stream', '--style', 'ndjson', '--level', 'info', '--predicate', READY_PREDICATE];
    task.standardOutput = $.NSFileHandle.fileHandleForWritingAtPath(path);
    task.standardError = $.NSFileHandle.fileHandleForWritingAtPath(errorsPath);
    task.standardInput = $.NSFileHandle.fileHandleWithNullDevice;
    task.launch;
    return { task: task, path: path, consumed: 0 };
}

function drainReadinessStream(stream, detector) {
    var lines = (readText(stream.path) || '').split('\n');
    // Последняя строка может быть недописана — её разберём на следующем круге.
    var complete = lines.length - 1;
    for (var i = stream.consumed; i < complete; i++) detector.add(lines[i]);
    stream.consumed = complete;
}

// retryCampo: один повторный подъём Siri AI, если за первый круг она ничего не сказала.
function waitForSiriReady(output, retryCampo) {
    makeDir(output);
    var detector = new Detector(bootUUID());
    var errors = [];
    var stream = startReadinessStream(output);
    var result;
    try {
        var historyOk = readinessSnapshot(detector, output, errors);
        // Будим Siri AI уже после старта потока: пропуск на старте закрывает дочитка журнала.
        var opened = exec('/usr/bin/open', ['-gj', '-b', 'com.apple.campo']);
        if (opened.code !== 0) errors.push(opened.err.trim());
        var settled = null, retried = false;
        var deadline = now() + READY_TIMEOUT;
        var lastSnapshot = now();
        while (true) {
            drainReadinessStream(stream, detector);
            var moment = now();
            if (detector.result().status === 'ready') {
                if (settled === null) settled = moment;
                if (moment - settled >= READY_SETTLE) {
                    // Сверяем поток и журнал, прежде чем признать успех.
                    historyOk = readinessSnapshot(detector, output, errors) || historyOk;
                    drainReadinessStream(stream, detector);
                    if (detector.result().status === 'ready' && stream.task.isRunning && historyOk) break;
                    settled = null;
                }
            } else settled = null;
            if (!stream.task.isRunning) {
                errors.push('log stream завершился раньше проверки');
                break;
            }
            if (moment - lastSnapshot >= HISTORY_EVERY) {
                historyOk = readinessSnapshot(detector, output, errors) || historyOk;
                lastSnapshot = now();
            }
            if (moment >= deadline) {
                historyOk = readinessSnapshot(detector, output, errors) || historyOk;
                drainReadinessStream(stream, detector);
                if (detector.result().status === 'ready') {
                    deadline = now() + 5; // успеху из последней дочитки тоже даём отстояться
                    continue;
                }
                // Явное «недоступно», включая языковые причины, не повторяем.
                if (retryCampo && !retried && detector.result().status === 'unconfirmed') {
                    retried = true;
                    killByName('Siri AI');
                    exec('/usr/bin/open', ['-gj', '-b', 'com.apple.campo']);
                    deadline = now() + READY_TIMEOUT;
                } else break;
            }
            sleep(0.2);
        }
        result = detector.result();
        if (!historyOk || !stream.task.isRunning) result.status = 'collection-error';
        result.retriedCampo = retried;
    } finally {
        if (stream.task.isRunning) {
            stream.task.terminate;
            sleep(0.5);
        }
    }
    result.diagnostics = readinessDiagnostics();
    result.collectionErrors = errors;
    writeJSON(output + '/result.json', result);
    return result;
}

function readinessDiagnostics() {
    var commands = {
        globalLanguages: ['/usr/bin/defaults', ['read', '-g', 'AppleLanguages']],
        globalLocale: ['/usr/bin/defaults', ['read', '-g', 'AppleLocale']],
        siriLanguage: ['/usr/bin/defaults', ['read', 'com.apple.assistant.backedup', 'Session Language']],
        bootTime: ['/usr/sbin/sysctl', ['-n', 'kern.boottime']]
    };
    var result = {};
    Object.keys(commands).forEach(function (key) {
        var r = exec(commands[key][0], commands[key][1]);
        result[key] = { exit: r.code, stdout: r.out, stderr: r.err };
    });
    return result;
}
