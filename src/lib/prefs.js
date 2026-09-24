// prefs.js — язык системы: чтение и запись глобальных настроек, выбор языка возврата.
// Меняются только пользовательские настройки (defaults -g), общесистемные не трогаются.

var PREF_KEYS = ['AppleLanguages', 'AppleLocale'];
var TARGET_FILE = 'target-language.json';

// Весь глобальный домен разом: defaults export отдаёт XML, его разбирает сама Foundation.
function prefs() {
    var raw = execOk('/usr/bin/defaults', ['export', '-g', '-']).out;
    var data = $(raw).dataUsingEncoding($.NSUTF8StringEncoding);
    // format/error передаём как null: $() здесь роняет JavaScriptCore.
    var plist = $.NSPropertyListSerialization.propertyListWithDataOptionsFormatError(
        data, $.NSPropertyListImmutable, null, null);
    if (plist.isNil()) throw new Error(t('error.prefsRead'));
    var all = ObjC.deepUnwrap(plist);
    var result = {};
    PREF_KEYS.forEach(function (key) {
        result[key] = (key in all) ? all[key] : null;
    });
    return result;
}

function writePrefs(values) {
    PREF_KEYS.forEach(function (key) {
        if (!(key in values)) return;
        var value = values[key];
        if (value === null || value === undefined) {
            var deleted = exec('/usr/bin/defaults', ['delete', '-g', key]);
            if (deleted.code !== 0 && deleted.err.indexOf('does not exist') === -1) throw new Error(deleted.err);
        } else if (Array.isArray(value)) {
            execOk('/usr/bin/defaults', ['write', '-g', key, '-array'].concat(value));
        } else {
            execOk('/usr/bin/defaults', ['write', '-g', key, '-string', String(value)]);
        }
    });
    if (!samePrefs(prefs(), values)) throw new Error(t('error.prefsVerify'));
}

function samePrefs(a, b) {
    return PREF_KEYS.every(function (key) {
        return JSON.stringify(a[key] === undefined ? null : a[key]) ===
               JSON.stringify(b[key] === undefined ? null : b[key]);
    });
}

// Английский первым, остальные языки пользователя следом: ru-US, en-US → en-US, ru-US.
function englishFor(original) {
    var rest = (original.AppleLanguages || []).filter(function (lang) { return lang.indexOf('en') !== 0; });
    return { AppleLanguages: ['en-US'].concat(rest), AppleLocale: 'en_US' };
}

function isEnglish(values) {
    var first = (values.AppleLanguages || ['en'])[0] || 'en';
    return first.indexOf('en') === 0;
}

// Язык code первым, с регионом текущей системы: en-US + ru → ru-US, en-US; локаль ru_US.
function targetFor(code, current) {
    var locale = (current.AppleLocale || 'en_US').split('@')[0].split('_');
    var region = locale[1] || 'US';
    var rest = (current.AppleLanguages || []).filter(function (lang) {
        return lang.split('-')[0] !== code;
    });
    return { AppleLanguages: [code + '-' + region].concat(rest), AppleLocale: code + '_' + region };
}

function savedTarget() {
    return (readJSON(statePath(TARGET_FILE)) || {}).preferences || null;
}

// Запоминает язык возврата: на неанглийской системе — текущий, на английской —
// выбранный при установке или сохранённый раньше.
function saveTarget(code) {
    var current = prefs();
    var values;
    if (!isEnglish(current)) {
        values = current;
    } else if (code) {
        values = targetFor(code, current);
    } else if (savedTarget()) {
        return { kept: true };
    } else {
        throw new Error(t('error.chooseLanguage'));
    }
    writeJSON(statePath(TARGET_FILE), { preferences: values, savedAt: now() });
    return { kept: false, languages: values.AppleLanguages };
}

// Для окна кнопки: на каком языке система сейчас и куда возвращаться.
function languageState() {
    var target = savedTarget() || {};
    var languages = target.AppleLanguages || [''];
    return { state: isEnglish(prefs()) ? 'english' : 'target', target: languages[0].split('-')[0] };
}

// Одно значение из чужого домена настроек. NSUserDefaults с именем домена читает
// его через cfprefsd — без запуска defaults и без разбора вывода.
function domainValue(domain, key) {
    var store = $.NSUserDefaults.alloc.initWithSuiteName(domain);
    if (store.isNil()) return null;
    var value = store.objectForKey(key);
    return (value && !value.isNil()) ? value : null;
}
