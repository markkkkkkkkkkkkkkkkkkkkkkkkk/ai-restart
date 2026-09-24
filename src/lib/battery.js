// battery.js — процент заряда числом в строке меню, как было до macOS 26.
// Начиная с 26-й macOS рисует число ВНУТРИ значка батареи, и вернуть его наружу
// системной настройкой нельзя: в Пункте управления есть только переключатель
// «показывать процент или нет».
//
// Поэтому весь индикатор рисуем сами: число и батарейка в ОДНОМ значке, как это
// было у системного. Отдельным значком рядом с системной батарейкой не выходит:
// между двумя значками строка меню держит свои поля, и зазор получается втрое
// шире, чем был. Системная батарейка на это время прячется, а как было
// у человека до нас, запоминается и возвращается, когда он нас выключит
// или удалит приложение.
//
// Поставить значок вплотную к батарейке программно нельзя: приватных методов
// у NSStatusItem для этого нет, а ключ «NSStatusItem Preferred Position» macOS 27
// не слушает — проверено. Место выбирается перетаскиванием с зажатым Cmd,
// autosaveName его запоминает.
//
// В фоне приложение ничего не запускает и по таймеру не просыпается: значок
// перерисовывается по событиям системы (см. «слежение за питанием»), а всё, что
// требует запуска процессов, делается только при открытии меню.

var BATTERY_FILE = 'battery.json';
// В русской типографике перед знаком процента пробел, и он неразрывный —
// ровно так это выглядело в строке меню раньше.
var PERCENT = '\u00a0%';
var BATTERY_MENU = 'AIRestartBatteryMenu';

// Обе настройки лежат в домене этого компьютера (-currentHost). Ключ
// «NSStatusItem Visible Battery» из обычного домена macOS 27 не слушает:
// проверено, значение 0 стоит, а батарейка на месте. Работает код модуля:
// 18 — показывать в строке меню, 8 — только в Пункте управления.
var CC_DOMAIN = 'com.apple.controlcenter';
var CC_PERCENT_KEY = 'BatteryShowPercentage';
var CC_MODULE_KEY = 'Battery';
var MODULE_IN_MENUBAR = 18, MODULE_HIDDEN = 8;

// Ссылки держим в глобальных: иначе сборщик мусора уберёт значок.
var batteryItem = null;

// --- питание прямо сейчас ---------------------------------------------------

// Всё берём у IOKit списком источников питания: он отвечает за микросекунды
// и ничего не запускает. Короткий путь, IOPSGetPercentRemaining, в собранном
// приложении отказывает с kIOReturnNotPrivileged (0xE00002C1), хотя в обычном
// скрипте работает, — проверено. CF-объекты мост отдаёт как NSArray/NSDictionary.
try {
    ObjC.bindFunction('IOPSCopyPowerSourcesInfo', ['id', []]);
    ObjC.bindFunction('IOPSCopyPowerSourcesList', ['id', ['id']]);
    ObjC.bindFunction('IOPSGetPowerSourceDescription', ['id', ['id', 'id']]);
} catch (error) { /* тогда powerNow() вернёт null, и значок не покажется */ }

// Всё, от чего зависит вид значка, или null, если аккумулятора нет (mini, Studio).
// Энергосбережение читаем свойством процесса: pmset ради этого запускать незачем.
function powerNow() {
    try {
        var blob = $.IOPSCopyPowerSourcesInfo();
        var list = $.IOPSCopyPowerSourcesList(blob);
        for (var i = 0; i < list.count; i++) {
            var source = ObjC.deepUnwrap($.IOPSGetPowerSourceDescription(blob, list.objectAtIndex(i)));
            if (!source || source.Type !== 'InternalBattery' || !source['Is Present']) continue;
            var level = Math.round(100 * source['Current Capacity'] / (source['Max Capacity'] || 100));
            var onPower = source['Power Source State'] === 'AC Power';
            return {
                level: level,
                state: source['Is Charged'] ? 'charged' : source['Is Charging'] ? 'charging'
                    : onPower ? 'ac' : 'discharging',
                lowPower: !!$.NSProcessInfo.processInfo.isLowPowerModeEnabled
            };
        }
    } catch (error) { /* ниже — как будто аккумулятора нет */ }
    return null;
}

// --- состояние --------------------------------------------------------------

function batteryState() {
    var saved = readJSON(statePath(BATTERY_FILE));
    return (saved && typeof saved === 'object') ? saved : {};
}

function saveBatteryField(key, value) {
    var state = batteryState();
    state[key] = value;
    writeJSON(statePath(BATTERY_FILE), state);
}

function batteryShown() {
    return batteryState().show === true;
}

// Значок процента может открывать меню AI Restart вместо своего. Тогда отдельный
// значок приложения не нужен — в переполненной строке меню это лишнее место.
function batteryAsMain() {
    return batteryState().asMain === true;
}

function setBatteryAsMain(value) {
    saveBatteryField('asMain', value);
}

// Порог низкого заряда: на нём значок краснеет и приходит уведомление — как
// системное предупреждение, которое macOS шлёт на десяти процентах.
var LOW_LEVELS = [5, 10, 15, 20], LOW_DEFAULT = 10;

function lowThreshold() {
    var saved = batteryState().lowLevel;
    return LOW_LEVELS.indexOf(saved) === -1 ? LOW_DEFAULT : saved;
}

function setLowThreshold(value) {
    saveBatteryField('lowLevel', value);
    lowWarned = false;
}

// Вид значка: 'modern' — заливка, как в macOS 27; 'classic' — обводка, как было
// до неё. Размеры у обоих одинаковые, меняется только рисунок внутри.
function batteryStyle() {
    return batteryState().style === 'classic' ? 'classic' : 'modern';
}

function setBatteryStyle(value) {
    saveBatteryField('style', value);
}

// --- сведения для меню -------------------------------------------------------

// Сколько осталось — это знает только pmset, поэтому его спрашиваем, но лишь
// при открытии меню. Без аккумулятора (mini, Studio) процента в выводе нет.
function batteryInfo() {
    var out = exec('/usr/bin/pmset', ['-g', 'batt']).out;
    if (!/\d+%/.test(out)) return null;
    var state = out.match(/\d+%;\s*([^;]+);/);
    var left = out.match(/(\d+):(\d\d) remaining/);
    return {
        state: state ? state[1].trim() : '',
        hours: left ? Number(left[1]) : null,
        minutes: left ? Number(left[2]) : null
    };
}

// Строка для меню: то же, что пишет системная батарейка.
function batteryLine(info) {
    var time = (info.hours === null) ? null
        : (info.hours ? t('battery.hours', { count: info.hours }) : '') +
          t('battery.minutes', { count: info.minutes });
    if (info.state === 'charged') return t('battery.charged');
    if (info.state === 'charging') return time ? t('battery.chargingTime', { time: time }) : t('battery.charging');
    if (info.state !== 'discharging') return t('battery.ac');
    return time ? t('battery.remaining', { time: time }) : t('battery.calculating');
}

// Ёмкость берём там же, где её показывают «Настройки → Аккумулятор»:
// system_profiler отдаёт ровно то число, что видно в системе (у ioreg
// MaxCapacity всегда 100 — это не та ёмкость). Отвечает он за десятые доли
// секунды, а меняется число раз в недели, поэтому держим его час.
var healthCache = null, HEALTH_TTL = 3600;

function batteryHealth() {
    if (healthCache && now() - healthCache.at < HEALTH_TTL) return healthCache.value;
    var out = exec('/usr/sbin/system_profiler', ['-xml', 'SPPowerDataType']).out;
    var value = null;
    if (out) {
        var plist = $.NSPropertyListSerialization.propertyListWithDataOptionsFormatError(
            $(out).dataUsingEncoding($.NSUTF8StringEncoding), $.NSPropertyListImmutable, null, null);
        if (!plist.isNil()) {
            (ObjC.deepUnwrap(plist)[0]._items || []).forEach(function (item) {
                var health = item.sppower_battery_health_info;
                if (health) {
                    value = {
                        capacity: health.sppower_battery_health_maximum_capacity,
                        cycles: health.sppower_battery_cycle_count
                    };
                }
            });
        }
    }
    healthCache = { at: now(), value: value };
    return value;
}

// --- кто тратит заряд --------------------------------------------------------

// Системное меню батареи показывает не загрузку процессора, а «энергопотребление»:
// оценку, в которую кроме процессорного времени входят пробуждения из сна, работа
// видеоядра и диск. Считает её ядро, а наружу отдаёт top — столбцом POWER, тем же
// числом, что показывает Монитор системы. Мгновенно его не спросить: top обязан
// снять два замера подряд, между ними секунда. Поэтому top запускается только
// при открытии меню и в фоне, а раздел дописывается в уже открытое меню, когда
// замер готов (это делает app.js). В остальное время top не запускается вовсе.
var ENERGY_ARGS = ['-l', '2', '-o', 'power', '-n', '24', '-s', '1', '-stats', 'pid,power'];
// Ниже этого числа приложения не показываем: у спокойно работающей программы
// энергопотребление держится единицами, и список из них бесполезен.
var ENERGY_MIN = 10, ENERGY_LIMIT = 3;
// Замер моложе этого переиспользуем: меню часто открывают несколько раз подряд.
var ENERGY_FRESH = 20;
// top отрабатывает за полторы секунды; если завис — через полминуты снимаем.
var ENERGY_TIMEOUT = 30;
var energyTask = null, energyPipe = null, energyStarted = 0;
var energyApps = null, energyAt = 0;

function energyFresh() {
    return energyApps !== null && now() - energyAt < ENERGY_FRESH;
}

function startEnergySample() {
    if (energyTask !== null || energyFresh()) return;
    try {
        var task = $.NSTask.alloc.init;
        task.launchPath = '/usr/bin/top';
        task.arguments = ENERGY_ARGS;
        var pipe = $.NSPipe.pipe;
        task.standardOutput = pipe;
        task.standardError = $.NSFileHandle.fileHandleWithNullDevice;
        task.launch;
        energyTask = task;
        energyPipe = pipe;
        energyStarted = now();
    } catch (error) { energyTask = null; energyPipe = null; }
}

// true — ждать больше нечего: замер готов (он в energyApps) или не удался.
function finishEnergySample() {
    if (energyTask === null) return true;
    if (energyTask.isRunning) {
        if (now() - energyStarted < ENERGY_TIMEOUT) return false;
        try { energyTask.terminate; } catch (error) { /* всё равно забудем про него */ }
        energyTask = null;
        energyPipe = null;
        return true;
    }
    var text = '';
    try {
        text = dataText(energyPipe.fileHandleForReading.readDataToEndOfFile);
    } catch (error) { /* не прочиталось — просто без списка */ }
    energyTask = null;
    energyPipe = null;
    // Первый замер top считает за всё время работы процесса, и только второй —
    // за секунду между ними. Поэтому берём последний блок вывода.
    var blocks = text.split(/PID\s+POWER[^\n]*\n/), rows = {};
    blocks[blocks.length - 1].split('\n').forEach(function (line) {
        var parts = line.match(/^\s*(\d+)\s+([\d.]+)/);
        if (parts && Number(parts[2])) rows[parts[1]] = Number(parts[2]);
    });
    energyApps = rankApps(rows);
    energyAt = now();
    return true;
}

// Складываем энергопотребление всех процессов программы вместе с её хелперами.
function rankApps(rows) {
    var apps = runningApps(), parents = parentPids(), totals = {};
    Object.keys(rows).forEach(function (pid) {
        var owner = ownerApp(pid, parents, apps.names);
        if (owner) totals[owner] = (totals[owner] || 0) + rows[pid];
    });
    return Object.keys(totals)
        .filter(function (name) { return totals[name] >= ENERGY_MIN; })
        .sort(function (a, b) { return totals[b] - totals[a]; })
        .slice(0, ENERGY_LIMIT)
        .map(function (name) { return { name: name, icon: apps.icons[name] || null }; });
}

// Имена берём у системы, а не из вывода ps: там русские буквы приходят
// экранированными («M-PM-=M-PM-4...»), а NSWorkspace отдаёт то же имя, что
// показывает Finder.
function runningApps() {
    var names = {}, icons = {};
    var apps = $.NSWorkspace.sharedWorkspace.runningApplications;
    for (var i = 0; i < apps.count; i++) {
        var app = apps.objectAtIndex(i);
        // Только обычные программы: у служб и агентов activationPolicy не 0,
        // и в списке они были бы мусором («siriactionsd» и подобное). Сравнивать
        // приходится с числом: константы NSApplicationActivationPolicy* мост
        // не отдаёт, и сравнение с undefined тихо выкидывало вообще всех.
        if (Number(app.activationPolicy) !== 0 || app.localizedName.isNil()) continue;
        var name = ObjC.unwrap(app.localizedName);
        names[String(Number(app.processIdentifier))] = name;
        if (!icons[name]) icons[name] = appIcon(app);
    }
    return { names: names, icons: icons };
}

// Значок программы читаем из её же бандла файлом: так он грузится всегда
// и не зависит от службы значков. Размер задаёт тот, кто его рисует.
function appIcon(app) {
    try {
        var bundle = $.NSBundle.bundleWithURL(app.bundleURL);
        var file = bundle.infoDictionary.objectForKey('CFBundleIconFile');
        if (file.isNil()) return null;
        var path = bundle.pathForResourceOfType(ObjC.unwrap(file).replace(/\.icns$/, ''), 'icns');
        if (path.isNil()) return null;
        var icon = $.NSImage.alloc.initWithContentsOfFile(path);
        return icon.isNil() ? null : icon;
    } catch (error) { return null; }
}

// Родители нужны только как запасной путь (см. ownerApp) — у дочерних процессов
// программ, например у команд, запущенных из неё, «ответственного» нет.
function parentPids() {
    var parents = {};
    exec('/bin/ps', ['-Ao', 'pid=,ppid=']).out.split('\n').forEach(function (line) {
        var parts = line.match(/^\s*(\d+)\s+(\d+)\s*$/);
        if (parts) parents[parts[1]] = parts[2];
    });
    return parents;
}

// «Ответственный процесс» — то, чем Монитор системы приписывает рендереры и
// хелперы их программе: Safari отвечает за свои com.apple.WebKit.WebContent,
// хотя запускает их launchd и родителем Safari не является.
try {
    ObjC.bindFunction('responsibility_get_pid_responsible_for_pid', ['int', ['int']]);
} catch (error) { /* обойдёмся родителями */ }

function ownerApp(pid, parents, names) {
    try {
        var responsible = String($.responsibility_get_pid_responsible_for_pid(Number(pid)));
        if (names[responsible]) return names[responsible];
    } catch (error) { /* пойдём по родителям */ }
    for (var step = 0; step < 6 && pid && pid !== '1'; step++) {
        if (names[pid]) return names[pid];
        pid = parents[pid];
    }
    return null;
}

// --- предупреждение о низком заряде -----------------------------------------

// Своё предупреждение нужно, потому что системное приходит на десяти процентах
// и порога у него нет. Шлём один раз за разряд: сбрасывается, когда воткнули
// провод или заряд поднялся выше порога.
var lowWarned = false;

function checkLowBattery(power) {
    if (power.state !== 'discharging' || power.level > lowThreshold()) {
        lowWarned = false;
        return;
    }
    // Если энергосбережение уже включено, предлагать нечего.
    if (lowWarned || power.lowPower) return;
    lowWarned = true;
    notify(t('battery.lowNotice', { level: power.level }));
}

// --- значок -----------------------------------------------------------------

// Значок собираем из НАСТОЯЩИХ ресурсов системы: картинки, которыми Пункт
// управления рисует батарейку в строке меню, лежат прямо внутри него. Берём
// оттуда пупырышек, молнию и её маску — тогда совпадает всё, вплоть до светлого
// просвета вокруг молнии, который Apple делает этой самой маской. Сам корпус
// в macOS 26+ рисуется заливкой, а не картинкой, поэтому это единственное, что
// мы рисуем сами — по размерам ресурса battery-outline (23 × 12).
var CONTROL_CENTER = '/System/Library/CoreServices/ControlCenter.app';
var BATTERY_W = 23, BATTERY_H = 12, BATTERY_RADIUS = 4;
// Пупырышек идёт отдельной картинкой 2 × 12 и ставится через точку от корпуса.
var CAP_W = 2, CAP_GAP = 1;
// Молния выше корпуса, и с корпусом 23 × 12 система берёт БОЛЬШОЙ вариант
// ресурса — battery-bolt-large 13 × 16 (маленький, 11 × 14, идёт к узкому
// корпусу battery-small-outline). Со старым 11 × 14 молния выходила на пятую
// часть меньше системной — это и было видно на снимке.
var BOLT_W = 13, BOLT_H = 16;
var BATTERY_BOX_H = BOLT_H;
// Прозрачность пустой части снята со снимка настоящей строки меню:
// (фон − цвет) / (фон − заливка). У пупырышка своя прозрачность уже внутри
// ресурса (0.6), поэтому его рисуем как есть.
var EMPTY_ALPHA = 0.46;
// Старый вид: тонкая обводка корпуса (1 pt) и заливка внутри неё, с отступом.
var LINE_WIDTH = 1, LINE_ALPHA = 0.5, FILL_INSET = 2, FILL_RADIUS = 1.5;
// Старый корпус скруглён заметно слабее нынешнего: тот почти пилюля, этот — нет.
var CLASSIC_RADIUS = 3;
// Пупырышек у старого значка маленький и по центру, а не во всю высоту.
var CLASSIC_CAP_W = 1.5, CLASSIC_CAP_H = 4.5;
// Поля по краям значка и зазор между числом и батарейкой. Своя ширина у значка
// заметно шире содержимого, и вокруг него получается больше воздуха, чем у
// системных, — поэтому ширину считаем сами.
var ITEM_PADDING = 3, TITLE_GAP = 2;

var batteryAssets = null;

function batteryAsset(name) {
    if (!batteryAssets) {
        batteryAssets = {};
        var bundle = $.NSBundle.bundleWithPath(CONTROL_CENTER);
        if (!bundle.isNil()) {
            ['battery-cap', 'battery-bolt-large', 'battery-bolt-mask-large'].forEach(function (key) {
                var image = bundle.imageForResource(key);
                batteryAssets[key] = image.isNil() ? null : image;
            });
        }
    }
    return batteryAssets[name] || null;
}

function roundedPath(x, y, width, height, radius) {
    return $.NSBezierPath.bezierPathWithRoundedRectXRadiusYRadius(
        $.NSMakeRect(x, y, width, height), radius, radius);
}

// Цвет заливки, как у системной: жёлтый в энергосбережении, красный на последних
// процентах — независимо от того, на проводе Mac или нет (снято со снимка:
// 3 % на зарядке, заливка красная). С какого процента краснеть — настраивается.
// В остальное время значок монохромный (template) — краску и оттенок строки
// меню macOS подставляет сама, нам важна только прозрачность.
function batteryTint(power) {
    if (power.lowPower) return $.NSColor.systemYellowColor;
    if (power.level <= lowThreshold() && power.state !== 'charged') return $.NSColor.systemRedColor;
    return null;
}

function drawAsset(image, x, y, width, height, operation) {
    image.drawInRectFromRectOperationFraction(
        $.NSMakeRect(x, y, width, height), $.NSZeroRect, operation, 1);
}

// Картинки системы нарисованы чёрным и рассчитаны на то, что цвет подставит
// строка меню. Она это делает только для монохромного значка (template), а на
// последних процентах и в энергосбережении значок цветной — тогда чёрное так
// чёрным и остаётся. Поэтому в цветном случае красим картинку сами: рисуем её
// и заливаем поверх «по своим пикселям» (sourceAtop), прозрачность картинки
// при этом сохраняется — у пупырышка она своя, 0.6.
function tintedAsset(image, color, width, height) {
    var tinted = $.NSImage.alloc.initWithSize($.NSMakeSize(width, height));
    tinted.lockFocus;
    drawAsset(image, 0, 0, width, height, $.NSCompositingOperationSourceOver);
    color.set;
    $.NSGraphicsContext.currentContext.compositingOperation = $.NSCompositingOperationSourceAtop;
    $.NSBezierPath.fillRect($.NSMakeRect(0, 0, width, height));
    tinted.unlockFocus;
    return tinted;
}

function batteryImage(power) {
    var tint = batteryTint(power);
    var ink = tint ? $.NSColor.labelColor : $.NSColor.blackColor;
    var level = Math.max(0, Math.min(1, power.level / 100));
    var bottom = (BATTERY_BOX_H - BATTERY_H) / 2;
    var image = $.NSImage.alloc.initWithSize(
        $.NSMakeSize(BATTERY_W + CAP_GAP + CAP_W, BATTERY_BOX_H));

    image.lockFocus;
    if (batteryStyle() === 'classic') {
        // Обводка рисуется по середине линии, поэтому прямоугольник ужимаем
        // на полтолщины — иначе половина линии уйдёт за край картинки.
        ink.colorWithAlphaComponent(LINE_ALPHA).set;
        var half = LINE_WIDTH / 2;
        var outline = roundedPath(half, bottom + half, BATTERY_W - LINE_WIDTH,
            BATTERY_H - LINE_WIDTH, CLASSIC_RADIUS - half);
        outline.lineWidth = LINE_WIDTH;
        outline.stroke;
        // Пупырышек той же бледности, что обводка, и в том же месте по ширине,
        // где у нового значка стоит его картинка, — значок не меняет размеров.
        roundedPath(BATTERY_W + CAP_GAP, bottom + (BATTERY_H - CLASSIC_CAP_H) / 2,
            CLASSIC_CAP_W, CLASSIC_CAP_H, CLASSIC_CAP_W / 2).fill;
        if (level > 0) {
            (tint || ink).set;
            roundedPath(FILL_INSET, bottom + FILL_INSET,
                (BATTERY_W - 2 * FILL_INSET) * level, BATTERY_H - 2 * FILL_INSET,
                FILL_RADIUS).fill;
        }
    } else {
        // Корпус целиком залит бледным, заряженная часть — яркая.
        ink.colorWithAlphaComponent(EMPTY_ALPHA).set;
        roundedPath(0, bottom, BATTERY_W, BATTERY_H, BATTERY_RADIUS).fill;
        if (level > 0) {
            $.NSGraphicsContext.saveGraphicsState;
            roundedPath(0, bottom, BATTERY_W, BATTERY_H, BATTERY_RADIUS).addClip;
            (tint || ink).set;
            $.NSBezierPath.fillRect($.NSMakeRect(0, bottom, BATTERY_W * level, BATTERY_H));
            $.NSGraphicsContext.restoreGraphicsState;
        }
        var cap = batteryAsset('battery-cap');
        if (cap) {
            if (tint) cap = tintedAsset(cap, ink, CAP_W, BATTERY_H);
            drawAsset(cap, BATTERY_W + CAP_GAP, bottom, CAP_W, BATTERY_H, $.NSCompositingOperationSourceOver);
        }
    }

    if (power.state !== 'discharging') {
        // Маска выбивает светлый просвет, поверх него ложится сама молния —
        // ровно так системная и собрана, потому маска и лежит рядом с молнией.
        var mask = batteryAsset('battery-bolt-mask-large'), bolt = batteryAsset('battery-bolt-large');
        var boltX = (BATTERY_W - BOLT_W) / 2;
        if (mask) drawAsset(mask, boltX, 0, BOLT_W, BOLT_H, $.NSCompositingOperationDestinationOut);
        if (bolt) {
            if (tint) bolt = tintedAsset(bolt, ink, BOLT_W, BOLT_H);
            drawAsset(bolt, boltX, 0, BOLT_W, BOLT_H, $.NSCompositingOperationSourceOver);
        }
    }
    image.unlockFocus;

    // Монохромную строка меню красит сама, цветную трогать нельзя.
    image.template = !tint;
    return image;
}

// Перерисовывает значок, только если что-то из видимого поменялось: процент,
// провод, зарядка, энергосбережение. force — после смены настроек значка.
var batteryShownKey = null;

function updateBattery(force) {
    if (!batteryItem) return;
    var power = powerNow();
    if (!power) { removeBatteryItem(); return; }
    var key = power.level + power.state + power.lowPower;
    if (!force && key === batteryShownKey) return;
    batteryShownKey = key;
    checkLowBattery(power);

    var button = batteryItem.button;
    // Цифры одинаковой ширины: иначе на каждом проценте батарейка дёргалась бы
    // влево-вправо. Системные часы набраны так же.
    var font = $.NSFont.monospacedDigitSystemFontOfSizeWeight(
        Number($.NSFont.systemFontSize), $.NSFontWeightRegular);
    var title = power.level + PERCENT;
    var symbol = batteryImage(power);
    button.font = font;
    button.title = title;
    button.image = symbol;
    button.imagePosition = $.NSImageRight;   // число слева, батарейка справа
    button.imageHugsTitle = true;            // иначе между ними лишнее поле
    var titleWidth = Number($(title).sizeWithAttributes(
        $.NSDictionary.dictionaryWithObjectForKey(font, $.NSFontAttributeName)).width);
    batteryItem.length = Math.ceil(titleWidth + TITLE_GAP + Number(symbol.size.width)) + 2 * ITEM_PADDING;
}

// --- слежение за питанием ---------------------------------------------------

// Значок меняется по событиям, а не по таймеру: IOKit объявляет смену процента
// и источника питания через notify, а notify умеет писать в файловый
// дескриптор. Его и слушаем — между событиями приложение спит и не
// просыпается вовсе. Энергосбережение объявляет сам Foundation, но из фонового
// потока, а JavaScript трогать не из главного нельзя, — поэтому подписка через
// блок в главной очереди.
var POWER_EVENTS = ['com.apple.system.powersources.percent', 'com.apple.system.powersources.source'];
var NOTIFY_REUSE = 1;   // второй ключ пишет в тот же дескриптор
try {
    ObjC.bindFunction('notify_register_file_descriptor', ['int', ['char *', 'int *', 'int', 'int *']]);
    ObjC.bindFunction('notify_cancel', ['int', ['int']]);
} catch (error) { /* тогда watchPower() включит запасной таймер */ }

var powerWatch = null, powerHandle = null, powerTokens = [], powerTimer = null, lowPowerWatch = null;
// Запасной путь, если notify недоступен: опрос раз в пять секунд с допуском,
// чтобы система могла совмещать пробуждения с чужими.
var POWER_POLL = 5, POWER_POLL_TOLERANCE = 2;

ObjC.registerSubclass({
    name: 'AIRestartPowerWatch',
    methods: {
        'powerChanged:': {
            types: ['void', ['id']],
            implementation: function (note) {
                // Вычитываем, что пришло, иначе дескриптор так и будет «готов».
                note.object.availableData;
                note.object.waitForDataInBackgroundAndNotify;
                updateBattery(false);
            }
        },
        'tick:': {
            types: ['void', ['id']],
            implementation: function () { updateBattery(false); }
        }
    }
});

function watchPower() {
    powerWatch = $.AIRestartPowerWatch.alloc.init;
    var center = $.NSNotificationCenter.defaultCenter;
    lowPowerWatch = center.addObserverForNameObjectQueueUsingBlock(
        'NSProcessInfoPowerStateDidChangeNotification', $(), $.NSOperationQueue.mainQueue,
        function () { updateBattery(false); });
    try {
        var fd = Ref(), token = Ref();
        for (var i = 0; i < POWER_EVENTS.length; i++) {
            if (Number($.notify_register_file_descriptor(POWER_EVENTS[i], fd, i ? NOTIFY_REUSE : 0, token)) !== 0) {
                throw new Error('notify: ' + POWER_EVENTS[i]);
            }
            powerTokens.push(Number(token[0]));
        }
        powerHandle = $.NSFileHandle.alloc.initWithFileDescriptorCloseOnDealloc(fd[0], false);
        center.addObserverSelectorNameObject(powerWatch, 'powerChanged:',
            'NSFileHandleDataAvailableNotification', powerHandle);
        powerHandle.waitForDataInBackgroundAndNotify;
    } catch (error) {
        logError('слежение за питанием', String(error.message || error) + ' — включаю опрос');
        stopPowerEvents();
        powerTimer = $.NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(
            POWER_POLL, powerWatch, 'tick:', $(), true);
        powerTimer.tolerance = POWER_POLL_TOLERANCE;
    }
}

function stopPowerEvents() {
    // notify_cancel последнего ключа сам закрывает общий дескриптор.
    powerTokens.forEach(function (token) { $.notify_cancel(token); });
    powerTokens = [];
    powerHandle = null;
}

function unwatchPower() {
    if (!powerWatch) return;
    $.NSNotificationCenter.defaultCenter.removeObserver(powerWatch);
    $.NSNotificationCenter.defaultCenter.removeObserver(lowPowerWatch);
    lowPowerWatch = null;
    stopPowerEvents();
    if (powerTimer) { powerTimer.invalidate; powerTimer = null; }
    powerWatch = null;
}

function installBatteryItem(menu) {
    removeBatteryItem();
    if (!batteryShown() || !powerNow()) return;
    batteryItem = $.NSStatusBar.systemStatusBar.statusItemWithLength(-1);
    // Место значка человек выбирает сам (Cmd + перетащить), autosaveName его помнит.
    batteryItem.autosaveName = 'AIRestartBatteryItem';
    // Меню приходит готовым: своё или главное — решает тот, кто нас вызвал.
    batteryItem.menu = menu;
    updateBattery(true);
    watchPower();
}

function removeBatteryItem() {
    unwatchPower();
    batteryShownKey = null;
    if (batteryItem) {
        $.NSStatusBar.systemStatusBar.removeStatusItem(batteryItem);
        batteryItem = null;
    }
}

// --- системная батарейка ----------------------------------------------------

function systemPercentShown() {
    var read = exec('/usr/bin/defaults', ['-currentHost', 'read', CC_DOMAIN, CC_PERCENT_KEY]);
    return read.code === 0 && read.out.trim() === '1';
}

// Ключа может не быть вовсе — значит, значок показывается по умолчанию.
function systemModuleValue() {
    var read = exec('/usr/bin/defaults', ['-currentHost', 'read', CC_DOMAIN, CC_MODULE_KEY]);
    return read.code === 0 ? Number(read.out.trim()) : null;
}

// Пункт управления перечитывает эти настройки только при запуске, поэтому его
// приходится перезапускать — значки в строке меню на секунду моргают.
function setSystemBattery(percent, module) {
    exec('/usr/bin/defaults',
        ['-currentHost', 'write', CC_DOMAIN, CC_PERCENT_KEY, '-bool', percent ? 'true' : 'false']);
    if (module === null) {
        exec('/usr/bin/defaults', ['-currentHost', 'delete', CC_DOMAIN, CC_MODULE_KEY]);
    } else {
        exec('/usr/bin/defaults',
            ['-currentHost', 'write', CC_DOMAIN, CC_MODULE_KEY, '-int', String(module)]);
    }
    killByName('ControlCenter');
}

// --- включение и выключение -------------------------------------------------

// Сам значок ставит refreshMenuBar: только он знает, какое меню к нему цеплять.
// Остальные настройки (вид, порог, «открывает меню») сохраняются как были.
function enableBattery() {
    var state = batteryState();
    state.show = true;
    state.systemPercentWas = systemPercentShown();
    state.systemModuleWas = systemModuleValue();
    writeJSON(statePath(BATTERY_FILE), state);
    setSystemBattery(false, MODULE_HIDDEN);
}

function disableBattery() {
    var state = batteryState();
    if (!state.show) return;
    state.show = false;
    writeJSON(statePath(BATTERY_FILE), state);
    removeBatteryItem();
    var module = (state.systemModuleWas === undefined) ? MODULE_IN_MENUBAR : state.systemModuleWas;
    setSystemBattery(state.systemPercentWas === true, module);
}
