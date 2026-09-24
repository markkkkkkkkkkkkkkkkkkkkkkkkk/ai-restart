// i18n.js — язык интерфейса. Русский для тех, у кого система русская, английский
// для всех остальных.
//
// Язык берём не из текущих настроек системы, а из сохранённого языка возврата:
// после перезагрузки приложение запускается, пока система ещё английская, и по
// текущим настройкам весь сеанс говорило бы по-английски. Язык возврата — это
// и есть родной язык человека. Пока он не сохранён (первый запуск на английской
// системе), смотрим на настройки системы.
//
// Строки логов сюда не входят: они пишутся в login.log для разбора неполадок
// и остаются русскими.

var UI_TEXT = {
    ru: {
        'common.ok': 'Понятно',
        'common.cancel': 'Отмена',
        'common.openSettings': 'Открыть настройки',

        'menu.restart': 'Перезагрузить…',
        'menu.shutdown': 'Выключить…',
        'menu.chatgpt': 'Подключить ChatGPT…',
        'menu.language': 'Вернуть язык…',
        'menu.setup': 'Первая настройка',
        'menu.settings': 'Настройки',
        'menu.guide': 'Инструкция',
        'menu.quit': 'Выход',
        'menu.uninstall': 'Удалить AI Restart',
        'menu.battery': 'Процент заряда в строке меню',
        'menu.batteryAsMain': 'Процент открывает меню AI Restart',
        'menu.style': 'Вид значка',
        'menu.styleModern': 'Как в macOS 27',
        'menu.styleClassic': 'Как в macOS 26',
        'menu.lowLevel': 'Низкий заряд',
        'menu.batteryDetails': 'Аккумулятор',
        'menu.batterySettings': 'Режим энергосбережения и настройки…',
        'menu.batteryOff': 'Убрать процент из строки меню',
        'menu.busy': 'Больше всего тратят заряд:',
        'menu.capacity': 'Ёмкость: {capacity} · Циклов: {cycles}',
        'menu.chargeUnknown': 'Заряд неизвестен',

        'battery.charged': 'Аккумулятор заряжен',
        'battery.charging': 'Идёт зарядка',
        'battery.chargingTime': 'До полной зарядки: {time}',
        'battery.ac': 'Питание от сети',
        'battery.remaining': 'Осталось: {time}',
        'battery.calculating': 'Осталось: идёт подсчёт…',
        'battery.hours': '{count}\u00a0ч ',
        'battery.minutes': '{count}\u00a0мин',
        'battery.lowNotice': 'Осталось {level}\u00a0% заряда. Включить режим энергосбережения: ' +
            'значок AI\u00a0Restart → «Аккумулятор» → «Режим энергосбережения и настройки…».',

        'leave.restartTitle': 'Вы действительно хотите перезагрузить компьютер?',
        'leave.shutdownTitle': 'Вы действительно хотите выключить компьютер?',
        'leave.restartCountdown': 'Если не производить никаких действий, компьютер автоматически ' +
            'перезагрузится. До\u00a0перезагрузки {seconds}.',
        'leave.shutdownCountdown': 'Если не производить никаких действий, компьютер автоматически ' +
            'выключится. До\u00a0выключения {seconds}.',
        'leave.restartButton': 'Перезагрузить',
        'leave.shutdownButton': 'Выключить',
        'leave.reopen': 'Снова открывать окна при\u00a0входе в\u00a0систему',

        'chatgpt.title': 'Подключить ChatGPT и перезагрузить компьютер?',
        'chatgpt.body': 'После входа система ненадолго останется английской и откроет настройки Siri: ' +
            'включи ChatGPT, войди в аккаунт и нажми «Готово». Войти в аккаунт можно только ' +
            'на английской системе — на твоём языке macOS считает ChatGPT недоступным.',
        'chatgpt.setup': 'Подключение ChatGPT. Пока система на английском:\n\n' +
            '1. В открывшихся настройках Apple Intelligence & Siri найди ChatGPT (раздел Extensions).\n' +
            '2. Включи расширение и нажми Sign In, войди в аккаунт.\n' +
            '3. Нажми «Готово» — язык вернётся на твой.\n\n' +
            'После этого в настройках снова будет «Войти…» — это нормально, НЕ нажимай: ' +
            'ChatGPT в Siri уже работает под твоим аккаунтом.',
        'chatgpt.skip': 'Пропустить',
        'chatgpt.done': 'Готово',
        'chatgpt.notEnabled': 'ChatGPT не включён в настройках — открой подключение ещё раз.',

        'language.title': 'Вернуть язык: {language}?',
        'language.body': 'Система сейчас на английском — так Apple Intelligence включает Siri AI. ' +
            'Когда Siri AI заработает, верни свой язык: без перезагрузки, приложения ' +
            'перезапустятся уже на нём.\n\n' +
            'Дальше перезагружай Mac только кнопкой AI Restart — иначе Siri AI не включится.',
        'language.button': 'Вернуть язык',
        'language.alreadyTitle': 'Язык уже свой',
        'language.alreadyBody': 'Система не на английском, возвращать нечего.',
        'language.ask': 'Система сейчас на английском. На какой язык возвращаться после перезагрузки?',

        'setup.doneTitle': 'Первая настройка уже пройдена',
        'setup.doneBody': 'Apple Intelligence до этого Mac уже дошла: Siri AI включается после ' +
            'перезагрузки отсюда, ничего настраивать не нужно.\n\n' +
            'Если Siri AI всё-таки не появляется, проверь язык Siri — он должен быть ' +
            'English (United States).',
        'setup.openAI': 'Открыть Apple Intelligence',
        'setup.step2Title': 'Шаг 2 из 3: включи Apple Intelligence',
        'setup.step2Body': 'Система уже на английском — это то, что нужно.\n\n' +
            '1. Открой Системные настройки → Apple Intelligence и Siri и включи Apple Intelligence.\n' +
            '2. Здесь же проверь, что язык Siri — English (United States).\n' +
            '3. Сразу после этого вернись в это меню и нажми «Вернуть язык…».\n\n' +
            'Очередь и загрузка моделей продолжатся на твоём языке — ждать в английской ' +
            'системе не нужно, это проверено. Дальше перезагружайся только отсюда, пока ' +
            'Siri AI не появится. Это может занять от нескольких часов до суток.',
        'setup.startTitle': 'Первая настройка: Siri AI ещё не приходила?',
        'setup.startBody': 'Apple Intelligence встаёт в очередь только на английской системе, ' +
            'и решается это при загрузке. Поэтому первый шаг делается руками:\n\n' +
            '1. Системные настройки → Основные → Язык и регион: добавь English (United States) ' +
            'и поставь первым. Там же язык Siri — English (United States).\n' +
            '2. Перезагрузись обычным способом, через меню Apple.\n' +
            '3. Вернись в это меню и нажми «Первая настройка» ещё раз — подскажу, что дальше.\n\n' +
            'Если Siri AI у тебя уже работает, ничего этого делать не нужно: просто ' +
            'перезагружайся через «Перезагрузить…».',
        'setup.openLanguage': 'Открыть настройки языка',

        'battery.enableTitle': 'Показывать процент заряда?',
        'battery.enableBody': 'В строке меню появится число и батарейка, как было до macOS 26. ' +
            'Системная батарейка на это время уйдёт в Пункт управления, чтобы значков не было ' +
            'два. Для этого на секунду перезапустится Пункт управления, значки моргнут.\n\n' +
            'Новый значок встанет слева от системных. Чтобы поставить его на место батарейки, ' +
            'перетащи его с зажатым Cmd — место запомнится.\n\n' +
            'Выключается этим же пунктом, системная батарейка вернётся.',
        'battery.enableButton': 'Показывать',
        'battery.noneTitle': 'Аккумулятора нет',
        'battery.noneBody': 'На этом Mac показывать нечего.',

        'uninstall.title': 'Удалить AI Restart?',
        'uninstall.body': 'Язык системы вернётся на твой, запуск при входе отключится, ' +
            'настройки и логи сотрутся. Само приложение останется — перетащи его в Корзину сам.',
        'uninstall.button': 'Удалить',
        'uninstall.doneTitle': 'AI Restart удалён',
        'uninstall.doneBody': 'Осталось перетащить приложение из «Программ» в Корзину.',

        'welcome.title': 'AI Restart установлен',
        'welcome.body': 'Значок появился в строке меню справа — оттуда и перезагружай.\n\n' +
            'Перезагружай и выключай Mac только через него: тогда после включения заработает ' +
            'Siri AI, а язык системы сам вернётся на твой.',

        'notify.ready': 'Enhanced Siri готова. Язык системы возвращён.',
        'notify.notReady': 'Siri AI в этой загрузке не включилась. Язык возвращён — попробуй ещё раз.',
        'notify.restored': 'Язык системы возвращён. Дальше перезагружайся через AI Restart.',

        'error.title': 'AI Restart не выполнен',
        'error.installTitle': 'AI Restart не установился',
        'error.bundle': 'Повреждён бандл: не найден {name}',
        'error.busy': 'Другая операция AI Restart уже выполняется — перезагрузка отменена',
        'error.stuckApps': 'Не закрылись приложения: {apps}.\nСохрани в них изменения и попробуй ещё раз.',
        'error.write': 'Не удалось записать {path}',
        'error.exit': '{command} завершился с кодом {code}: {details}',
        'error.prefsRead': 'Не удалось прочитать глобальные настройки',
        'error.prefsVerify': 'Глобальные настройки не перечитались обратно',
        'error.chooseLanguage': 'Система на английском: выбери язык, на который возвращаться',
        'error.noLanguageChosen': 'Язык возврата не выбран — без него кнопка не сможет вернуть язык',
        'error.agent': 'Не удалось включить запуск при входе: {details}',
        'error.otherBoot': 'Откат относится к другой загрузке',
        'error.unfinished': 'Незавершённая операция: сначала верни язык кнопкой «Вернуть язык…»',
        'error.alreadyEnglish': 'Язык системы уже английский — сначала верни свой язык кнопкой AI Restart',
        'error.markerNoOperation': 'Метка ожидания без операции — восстанавливать нечего',
        'error.notEnglishBoot': 'Английские настройки не активны — это не английская загрузка',
        'error.neverRun': 'Сохранённого языка нет — AI Restart ещё ни разу не запускался',
        'error.noTarget': 'Язык для возврата не сохранён — открой настройки приложения',

        'guide.file': 'Инструкция.txt'
    },

    en: {
        'common.ok': 'OK',
        'common.cancel': 'Cancel',
        'common.openSettings': 'Open Settings',

        'menu.restart': 'Restart…',
        'menu.shutdown': 'Shut Down…',
        'menu.chatgpt': 'Connect ChatGPT…',
        'menu.language': 'Restore Language…',
        'menu.setup': 'First Setup',
        'menu.settings': 'Settings',
        'menu.guide': 'Instructions',
        'menu.quit': 'Quit',
        'menu.uninstall': 'Uninstall AI Restart',
        'menu.battery': 'Battery Percentage in Menu Bar',
        'menu.batteryAsMain': 'Percentage Opens AI Restart Menu',
        'menu.style': 'Icon Style',
        'menu.styleModern': 'Like macOS 27',
        'menu.styleClassic': 'Like macOS 26',
        'menu.lowLevel': 'Low Battery',
        'menu.batteryDetails': 'Battery',
        'menu.batterySettings': 'Low Power Mode and Settings…',
        'menu.batteryOff': 'Hide Percentage from Menu Bar',
        'menu.busy': 'Using the most energy:',
        'menu.capacity': 'Capacity: {capacity} · Cycles: {cycles}',
        'menu.chargeUnknown': 'Charge unknown',

        'battery.charged': 'Battery charged',
        'battery.charging': 'Charging',
        'battery.chargingTime': 'Time to full charge: {time}',
        'battery.ac': 'Power adapter',
        'battery.remaining': 'Time remaining: {time}',
        'battery.calculating': 'Time remaining: calculating…',
        'battery.hours': '{count}\u00a0hr ',
        'battery.minutes': '{count}\u00a0min',
        'battery.lowNotice': 'Battery at {level}\u00a0%. To turn on Low Power Mode: ' +
            'AI\u00a0Restart icon → “Battery” → “Low Power Mode and Settings…”.',

        'leave.restartTitle': 'Are you sure you want to restart your computer?',
        'leave.shutdownTitle': 'Are you sure you want to shut down your computer?',
        'leave.restartCountdown': 'If you do nothing, the computer will restart automatically ' +
            'in {seconds}.',
        'leave.shutdownCountdown': 'If you do nothing, the computer will shut down automatically ' +
            'in {seconds}.',
        'leave.restartButton': 'Restart',
        'leave.shutdownButton': 'Shut Down',
        'leave.reopen': 'Reopen windows when logging back in',

        'chatgpt.title': 'Connect ChatGPT and restart the computer?',
        'chatgpt.body': 'After login the system stays in English for a little while and opens Siri ' +
            'settings: turn on ChatGPT, sign in and press Done. Signing in only works while the ' +
            'system is in English — in your language macOS considers ChatGPT unavailable.',
        'chatgpt.setup': 'Connecting ChatGPT. While the system is still in English:\n\n' +
            '1. In the Apple Intelligence & Siri settings that just opened, find ChatGPT ' +
            '(Extensions section).\n' +
            '2. Turn the extension on, press Sign In and sign in to your account.\n' +
            '3. Press Done — your language will come back.\n\n' +
            'Afterwards the settings will show “Sign In…” again. That is normal, do NOT press it: ' +
            'ChatGPT in Siri already works under your account.',
        'chatgpt.skip': 'Skip',
        'chatgpt.done': 'Done',
        'chatgpt.notEnabled': 'ChatGPT is not turned on in settings — start the connection again.',

        'language.title': 'Restore language: {language}?',
        'language.body': 'The system is in English right now — that is how Apple Intelligence turns ' +
            'on Siri AI. Once Siri AI works, switch your language back: no restart needed, your ' +
            'apps will relaunch in it.\n\n' +
            'From now on restart the Mac only with the AI Restart button, otherwise Siri AI will ' +
            'not turn on.',
        'language.button': 'Restore Language',
        'language.alreadyTitle': 'Language is already yours',
        'language.alreadyBody': 'The system is not in English, there is nothing to restore.',
        'language.ask': 'The system is in English right now. Which language should it return to ' +
            'after a restart?',

        'setup.doneTitle': 'First setup is already done',
        'setup.doneBody': 'Apple Intelligence has already reached this Mac: Siri AI turns on after ' +
            'a restart from here, nothing to set up.\n\n' +
            'If Siri AI still does not show up, check the Siri language — it has to be ' +
            'English (United States).',
        'setup.openAI': 'Open Apple Intelligence',
        'setup.step2Title': 'Step 2 of 3: turn on Apple Intelligence',
        'setup.step2Body': 'The system is already in English — that is what we need.\n\n' +
            '1. Open System Settings → Apple Intelligence & Siri and turn on Apple Intelligence.\n' +
            '2. While there, make sure the Siri language is English (United States).\n' +
            '3. Right after that come back to this menu and press “Restore Language…”.\n\n' +
            'The waitlist and the model download continue in your own language — you do not have ' +
            'to sit in an English system, this has been tested. From then on restart only from ' +
            'here until Siri AI shows up. It can take from a few hours to a day.',
        'setup.startTitle': 'First setup: no Siri AI yet?',
        'setup.startBody': 'Apple Intelligence only puts you on the waitlist while the system is in ' +
            'English, and that is decided at boot. So the first step is done by hand:\n\n' +
            '1. System Settings → General → Language & Region: add English (United States) and ' +
            'move it to the top. Set the Siri language to English (United States) as well.\n' +
            '2. Restart the normal way, from the Apple menu.\n' +
            '3. Come back to this menu and press “First Setup” again — it will tell you what is next.\n\n' +
            'If Siri AI already works for you, none of this is needed: just restart with “Restart…”.',
        'setup.openLanguage': 'Open Language Settings',

        'battery.enableTitle': 'Show the battery percentage?',
        'battery.enableBody': 'A number and a battery will appear in the menu bar, the way it was ' +
            'before macOS 26. The system battery moves to Control Center meanwhile, so there are ' +
            'not two icons. Control Center restarts for a second and the icons blink.\n\n' +
            'The new icon appears to the left of the system ones. To put it where the battery was, ' +
            'drag it while holding Cmd — the spot is remembered.\n\n' +
            'The same menu item turns it off and brings the system battery back.',
        'battery.enableButton': 'Show',
        'battery.noneTitle': 'No battery',
        'battery.noneBody': 'There is nothing to show on this Mac.',

        'uninstall.title': 'Uninstall AI Restart?',
        'uninstall.body': 'Your system language will be restored, the login item will be removed, ' +
            'settings and logs will be erased. The app itself stays — drag it to the Trash yourself.',
        'uninstall.button': 'Uninstall',
        'uninstall.doneTitle': 'AI Restart uninstalled',
        'uninstall.doneBody': 'All that is left is to drag the app from Applications to the Trash.',

        'welcome.title': 'AI Restart installed',
        'welcome.body': 'The icon is now in the menu bar on the right — restart from there.\n\n' +
            'Restart and shut down the Mac only through it: then Siri AI works after boot and the ' +
            'system language comes back to yours by itself.',

        'notify.ready': 'Enhanced Siri is ready. System language restored.',
        'notify.notReady': 'Siri AI did not turn on this boot. Language restored — try again.',
        'notify.restored': 'System language restored. From now on restart through AI Restart.',

        'error.title': 'AI Restart failed',
        'error.installTitle': 'AI Restart could not install itself',
        'error.bundle': 'Damaged bundle: {name} is missing',
        'error.busy': 'Another AI Restart operation is already running — restart cancelled',
        'error.stuckApps': 'These apps did not quit: {apps}.\nSave your changes there and try again.',
        'error.write': 'Could not write {path}',
        'error.exit': '{command} exited with code {code}: {details}',
        'error.prefsRead': 'Could not read the global preferences',
        'error.prefsVerify': 'The global preferences did not read back',
        'error.chooseLanguage': 'The system is in English: choose the language to return to',
        'error.noLanguageChosen': 'No language chosen — without it the button cannot restore your language',
        'error.agent': 'Could not enable the login item: {details}',
        'error.otherBoot': 'The rollback belongs to a different boot',
        'error.unfinished': 'Unfinished operation: restore your language first with “Restore Language…”',
        'error.alreadyEnglish': 'The system language is already English — restore your language first with AI Restart',
        'error.markerNoOperation': 'A pending marker without an operation — nothing to restore',
        'error.notEnglishBoot': 'The English preferences are not active — this is not an English boot',
        'error.neverRun': 'No saved language — AI Restart has never run before',
        'error.noTarget': 'No language saved to return to — open the app settings',

        'guide.file': 'Guide.txt'
    }
};

var uiLang = null;

function uiLanguage() {
    if (uiLang) return uiLang;
    var code = '';
    try {
        var target = savedTarget();
        code = (target && target.AppleLanguages && target.AppleLanguages[0]) || '';
    } catch (error) { /* настроек ещё нет — спросим систему */ }
    if (!code) {
        try { code = ObjC.unwrap($.NSLocale.preferredLanguages.objectAtIndex(0)); } catch (error) { code = ''; }
    }
    uiLang = /^ru/i.test(String(code)) ? 'ru' : 'en';
    return uiLang;
}

// t('menu.restart') или t('menu.capacity', { capacity: '87 %', cycles: 324 }).
function t(key, values) {
    var text = UI_TEXT[uiLanguage()][key];
    if (text === undefined) text = UI_TEXT.en[key];
    if (text === undefined) return key;
    if (values) {
        Object.keys(values).forEach(function (name) {
            text = text.split('{' + name + '}').join(String(values[name]));
        });
    }
    return text;
}

// Счёт секунд: в русском три формы, в английском две.
function secondsText(count) {
    if (uiLanguage() !== 'ru') return count + '\u00a0second' + (count === 1 ? '' : 's');
    var tail = count % 100, last = count % 10;
    var word = (tail >= 11 && tail <= 14) ? 'секунд'
        : last === 1 ? 'секунду'
        : (last >= 2 && last <= 4) ? 'секунды' : 'секунд';
    return count + '\u00a0' + word;
}
