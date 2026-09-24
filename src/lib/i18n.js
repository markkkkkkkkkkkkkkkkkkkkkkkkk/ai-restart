// i18n.js — язык интерфейса. По умолчанию подбирается сам, но его можно выбрать
// руками: «Настройки → Язык интерфейса».
//
// Автоподбор берёт язык не из текущих настроек системы, а из сохранённого языка возврата:
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
        'menu.uiLanguage': 'Язык интерфейса',
        'menu.uiAuto': 'Как в системе',
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
        'battery.enableBody': 'В строке меню появится число и батарейка, как было до macOS 27. ' +
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
        'menu.uiLanguage': 'Interface Language',
        'menu.uiAuto': 'Match System',
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
            'before macOS 27. The system battery moves to Control Center meanwhile, so there are ' +
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
    },

    pl: {
        'common.ok': 'OK',
        'common.cancel': 'Anuluj',
        'common.openSettings': 'Otwórz Ustawienia',

        'menu.restart': 'Uruchom ponownie…',
        'menu.shutdown': 'Wyłącz…',
        'menu.chatgpt': 'Połącz ChatGPT…',
        'menu.language': 'Przywróć język…',
        'menu.setup': 'Pierwsza konfiguracja',
        'menu.settings': 'Ustawienia',
        'menu.guide': 'Instrukcja',
        'menu.quit': 'Zakończ',
        'menu.uninstall': 'Odinstaluj AI Restart',
        'menu.battery': 'Procent baterii na pasku menu',
        'menu.batteryAsMain': 'Procent otwiera menu AI Restart',
        'menu.style': 'Wygląd ikony',
        'menu.styleModern': 'Jak w macOS 27',
        'menu.styleClassic': 'Jak w macOS 26',
        'menu.lowLevel': 'Niski poziom baterii',
        'menu.uiLanguage': 'Język interfejsu',
        'menu.uiAuto': 'Jak w systemie',
        'menu.batteryDetails': 'Bateria',
        'menu.batterySettings': 'Tryb niskiego zużycia energii i ustawienia…',
        'menu.batteryOff': 'Ukryj procent z paska menu',
        'menu.busy': 'Najwięcej energii zużywają:',
        'menu.capacity': 'Pojemność: {capacity} · Cykle: {cycles}',
        'menu.chargeUnknown': 'Nieznany poziom naładowania',

        'battery.charged': 'Bateria naładowana',
        'battery.charging': 'Ładowanie',
        'battery.chargingTime': 'Do pełnego naładowania: {time}',
        'battery.ac': 'Zasilacz',
        'battery.remaining': 'Pozostały czas: {time}',
        'battery.calculating': 'Pozostały czas: obliczanie…',
        'battery.hours': '{count}\u00a0godz ',
        'battery.minutes': '{count}\u00a0min',
        'battery.lowNotice': 'Bateria na poziomie {level}\u00a0%. Aby włączyć tryb niskiego zużycia energii: ikona ' +
            'AI\u00a0Restart → „Bateria” → „Tryb niskiego zużycia energii i ustawienia…”.',

        'leave.restartTitle': 'Czy na pewno chcesz uruchomić komputer ponownie?',
        'leave.shutdownTitle': 'Czy na pewno chcesz wyłączyć komputer?',
        'leave.restartCountdown': 'Jeśli nic nie zrobisz, komputer uruchomi się ponownie automatycznie za {seconds}.',
        'leave.shutdownCountdown': 'Jeśli nic nie zrobisz, komputer wyłączy się automatycznie za {seconds}.',
        'leave.restartButton': 'Uruchom ponownie',
        'leave.shutdownButton': 'Wyłącz',
        'leave.reopen': 'Otwórz ponownie okna po zalogowaniu',

        'chatgpt.title': 'Połączyć ChatGPT i uruchomić komputer ponownie?',
        'chatgpt.body': 'Po zalogowaniu system przez chwilę pozostanie po angielsku i otworzy ustawienia ' +
            'Siri: włącz ChatGPT, zaloguj się i naciśnij Done. Logowanie działa tylko wtedy, gdy ' +
            'system jest po angielsku — w Twoim języku macOS uznaje ChatGPT za niedostępny.',
        'chatgpt.setup': 'Łączenie ChatGPT. Dopóki system jest jeszcze po angielsku:\n\n1. W otwartych ' +
            'ustawieniach Apple Intelligence & Siri znajdź ChatGPT (sekcja Extensions).\n2. Włącz ' +
            'rozszerzenie, naciśnij Sign In i zaloguj się na swoje konto.\n3. Naciśnij Done — ' +
            'Twój język wróci.\n\nPotem w ustawieniach znowu pojawi się „Sign In…”. To normalne, ' +
            'NIE naciskaj tego: ChatGPT w Siri już działa na Twoim koncie.',
        'chatgpt.skip': 'Pomiń',
        'chatgpt.done': 'Gotowe',
        'chatgpt.notEnabled': 'ChatGPT nie jest włączony w ustawieniach — zacznij łączenie od nowa.',

        'language.title': 'Przywrócić język: {language}?',
        'language.body': 'System jest teraz po angielsku — właśnie tak Apple Intelligence włącza Siri AI. ' +
            'Kiedy Siri AI już działa, przełącz z powrotem swój język: ponowne uruchomienie nie ' +
            'jest potrzebne, programy otworzą się w nim na nowo.\n\nOd teraz uruchamiaj Maca ' +
            'ponownie tylko przyciskiem AI Restart, inaczej Siri AI się nie włączy.',
        'language.button': 'Przywróć język',
        'language.alreadyTitle': 'Język jest już Twój',
        'language.alreadyBody': 'System nie jest po angielsku, nie ma czego przywracać.',
        'language.ask': 'System jest teraz po angielsku. Na jaki język ma wrócić po ponownym uruchomieniu?',

        'setup.doneTitle': 'Pierwsza konfiguracja jest już zrobiona',
        'setup.doneBody': 'Apple Intelligence jest już na tym Macu: Siri AI włącza się po ponownym uruchomieniu ' +
            'stąd, nie ma czego konfigurować.\n\nJeśli Siri AI nadal się nie pojawia, sprawdź ' +
            'język Siri — musi być English (United States).',
        'setup.openAI': 'Otwórz Apple Intelligence',
        'setup.step2Title': 'Krok 2 z 3: włącz Apple Intelligence',
        'setup.step2Body': 'System jest już po angielsku — o to właśnie chodzi.\n\n1. Otwórz Ustawienia ' +
            'systemowe → Apple Intelligence & Siri i włącz Apple Intelligence.\n2. Przy okazji ' +
            'upewnij się, że językiem Siri jest English (United States).\n3. Zaraz potem wróć do ' +
            'tego menu i naciśnij „Przywróć język…”.\n\nLista oczekujących i pobieranie modelu ' +
            'działają dalej w Twoim języku — nie musisz siedzieć w angielskim systemie, to ' +
            'zostało sprawdzone. Od tej pory uruchamiaj ponownie tylko stąd, dopóki Siri AI się ' +
            'nie pojawi. Może to potrwać od kilku godzin do doby.',
        'setup.startTitle': 'Pierwsza konfiguracja: nie masz jeszcze Siri AI?',
        'setup.startBody': 'Apple Intelligence wpisuje na listę oczekujących tylko wtedy, gdy system jest po ' +
            'angielsku, a decyduje się to przy starcie. Dlatego pierwszy krok robi się ' +
            'ręcznie:\n\n1. Ustawienia systemowe → Ogólne → Język i region: dodaj English (United ' +
            'States) i przesuń na górę. Ustaw też język Siri na English (United States).\n2. ' +
            'Uruchom ponownie zwyczajnie, z menu Apple.\n3. Wróć do tego menu i naciśnij ' +
            '„Pierwsza konfiguracja” jeszcze raz — podpowie, co dalej.\n\nJeśli Siri AI już u ' +
            'Ciebie działa, nic z tego nie jest potrzebne: po prostu uruchom ponownie przez ' +
            '„Uruchom ponownie…”.',
        'setup.openLanguage': 'Otwórz ustawienia języka',

        'battery.enableTitle': 'Pokazać procent baterii?',
        'battery.enableBody': 'Na pasku menu pojawi się liczba i bateria, tak jak było przed macOS 27. Systemowa ' +
            'bateria przeniesie się w tym czasie do Centrum sterowania, żeby nie było dwóch ikon. ' +
            'Centrum sterowania uruchomi się na sekundę ponownie i ikony mrugną.\n\nNowa ikona ' +
            'pojawi się po lewej stronie systemowych. Aby postawić ją tam, gdzie była bateria, ' +
            'przeciągnij ją z wciśniętym Cmd — miejsce zostanie zapamiętane.\n\nTa sama pozycja ' +
            'menu wyłącza ją i przywraca systemową baterię.',
        'battery.enableButton': 'Pokaż',
        'battery.noneTitle': 'Brak baterii',
        'battery.noneBody': 'Na tym Macu nie ma czego pokazywać.',

        'uninstall.title': 'Odinstalować AI Restart?',
        'uninstall.body': 'Język systemu zostanie przywrócony, uruchamianie przy logowaniu wyłączone, ' +
            'ustawienia i dzienniki usunięte. Sam program zostaje — przeciągnij go do Kosza ' +
            'samodzielnie.',
        'uninstall.button': 'Odinstaluj',
        'uninstall.doneTitle': 'AI Restart odinstalowany',
        'uninstall.doneBody': 'Zostało tylko przeciągnąć program z Aplikacji do Kosza.',

        'welcome.title': 'AI Restart zainstalowany',
        'welcome.body': 'Ikona jest teraz na pasku menu po prawej — stamtąd uruchamiaj ' +
            'ponownie.\n\nUruchamiaj ponownie i wyłączaj Maca tylko przez nią: wtedy Siri AI ' +
            'działa po starcie, a język systemu sam wraca do Twojego.',

        'notify.ready': 'Enhanced Siri gotowa. Język systemu przywrócony.',
        'notify.notReady': 'Siri AI nie włączyła się przy tym starcie. Język przywrócony — spróbuj jeszcze raz.',
        'notify.restored': 'Język systemu przywrócony. Od teraz uruchamiaj ponownie przez AI Restart.',

        'error.title': 'AI Restart nie zadziałał',
        'error.installTitle': 'AI Restart nie mógł się zainstalować',
        'error.bundle': 'Uszkodzony pakiet: brakuje {name}',
        'error.busy': 'Inna operacja AI Restart już trwa — ponowne uruchomienie anulowane',
        'error.stuckApps': 'Te programy się nie zamknęły: {apps}.\nZapisz w nich zmiany i spróbuj ponownie.',
        'error.write': 'Nie udało się zapisać {path}',
        'error.exit': '{command} zakończył się kodem {code}: {details}',
        'error.prefsRead': 'Nie udało się odczytać ustawień globalnych',
        'error.prefsVerify': 'Ustawienia globalne nie odczytały się z powrotem',
        'error.chooseLanguage': 'System jest po angielsku: wybierz język powrotu',
        'error.noLanguageChosen': 'Nie wybrano języka — bez niego przycisk nie przywróci Twojego języka',
        'error.agent': 'Nie udało się włączyć uruchamiania przy logowaniu: {details}',
        'error.otherBoot': 'Wycofanie należy do innego uruchomienia systemu',
        'error.unfinished': 'Niedokończona operacja: najpierw przywróć język przez „Przywróć język…”',
        'error.alreadyEnglish': 'Język systemu jest już angielski — najpierw przywróć swój język przez AI Restart',
        'error.markerNoOperation': 'Znacznik oczekiwania bez operacji — nie ma czego przywracać',
        'error.notEnglishBoot': 'Angielskie ustawienia nie są aktywne — to nie jest angielskie uruchomienie',
        'error.neverRun': 'Brak zapisanego języka — AI Restart nigdy wcześniej nie działał',
        'error.noTarget': 'Nie zapisano języka powrotu — otwórz ustawienia programu',

        'guide.file': 'Guide.txt'
    },

    uk: {
        'common.ok': 'Зрозуміло',
        'common.cancel': 'Скасувати',
        'common.openSettings': 'Відкрити налаштування',

        'menu.restart': 'Перезавантажити…',
        'menu.shutdown': 'Вимкнути…',
        'menu.chatgpt': 'Підключити ChatGPT…',
        'menu.language': 'Повернути мову…',
        'menu.setup': 'Перше налаштування',
        'menu.settings': 'Налаштування',
        'menu.guide': 'Інструкція',
        'menu.quit': 'Вихід',
        'menu.uninstall': 'Видалити AI Restart',
        'menu.battery': 'Відсоток заряду в рядку меню',
        'menu.batteryAsMain': 'Відсоток відкриває меню AI Restart',
        'menu.style': 'Вигляд значка',
        'menu.styleModern': 'Як у macOS 27',
        'menu.styleClassic': 'Як у macOS 26',
        'menu.lowLevel': 'Низький заряд',
        'menu.uiLanguage': 'Мова інтерфейсу',
        'menu.uiAuto': 'Як у системі',
        'menu.batteryDetails': 'Акумулятор',
        'menu.batterySettings': 'Режим енергозбереження та налаштування…',
        'menu.batteryOff': 'Прибрати відсоток із рядка меню',
        'menu.busy': 'Найбільше витрачають заряд:',
        'menu.capacity': 'Ємність: {capacity} · Циклів: {cycles}',
        'menu.chargeUnknown': 'Заряд невідомий',

        'battery.charged': 'Акумулятор заряджено',
        'battery.charging': 'Заряджання',
        'battery.chargingTime': 'До повного заряду: {time}',
        'battery.ac': 'Живлення від мережі',
        'battery.remaining': 'Залишилось: {time}',
        'battery.calculating': 'Залишилось: обчислення…',
        'battery.hours': '{count}\u00a0год ',
        'battery.minutes': '{count}\u00a0хв',
        'battery.lowNotice': 'Заряд {level}\u00a0%. Щоб увімкнути режим енергозбереження: значок AI\u00a0Restart → ' +
            '«Акумулятор» → «Режим енергозбереження та налаштування…».',

        'leave.restartTitle': 'Дійсно перезавантажити комп’ютер?',
        'leave.shutdownTitle': 'Дійсно вимкнути комп’ютер?',
        'leave.restartCountdown': 'Якщо нічого не робити, комп’ютер перезавантажиться сам через {seconds}.',
        'leave.shutdownCountdown': 'Якщо нічого не робити, комп’ютер вимкнеться сам через {seconds}.',
        'leave.restartButton': 'Перезавантажити',
        'leave.shutdownButton': 'Вимкнути',
        'leave.reopen': 'Знову відкрити вікна після входу',

        'chatgpt.title': 'Підключити ChatGPT і перезавантажити комп’ютер?',
        'chatgpt.body': 'Після входу система деякий час лишиться англійською й відкриє налаштування Siri: ' +
            'увімкни ChatGPT, увійди в акаунт і натисни Done. Вхід працює лише на англійській ' +
            'системі — твоєю мовою macOS вважає ChatGPT недоступним.',
        'chatgpt.setup': 'Підключення ChatGPT. Поки система ще англійською:\n\n1. У відкритих налаштуваннях ' +
            'Apple Intelligence & Siri знайди ChatGPT (розділ Extensions).\n2. Увімкни ' +
            'розширення, натисни Sign In і увійди в акаунт.\n3. Натисни Done — мова ' +
            'повернеться.\n\nПотім у налаштуваннях знову буде «Sign In…». Це нормально, НЕ ' +
            'натискай: ChatGPT у Siri вже працює під твоїм акаунтом.',
        'chatgpt.skip': 'Пропустити',
        'chatgpt.done': 'Готово',
        'chatgpt.notEnabled': 'ChatGPT не ввімкнено в налаштуваннях — почни підключення знову.',

        'language.title': 'Повернути мову: {language}?',
        'language.body': 'Зараз система англійською — саме так Apple Intelligence вмикає Siri AI. Коли Siri AI ' +
            'працює, поверни свою мову: перезавантаження не потрібне, програми відкриються знову ' +
            'вже нею.\n\nВідтепер перезавантажуй Mac лише кнопкою AI Restart, інакше Siri AI не ' +
            'ввімкнеться.',
        'language.button': 'Повернути мову',
        'language.alreadyTitle': 'Мова вже твоя',
        'language.alreadyBody': 'Система не англійською, повертати нічого.',
        'language.ask': 'Зараз система англійською. На яку мову повертатися після перезавантаження?',

        'setup.doneTitle': 'Перше налаштування вже зроблено',
        'setup.doneBody': 'Apple Intelligence уже на цьому Mac: Siri AI вмикається після перезавантаження ' +
            'звідси, налаштовувати нічого.\n\nЯкщо Siri AI усе одно не з’являється, перевір мову ' +
            'Siri — має бути English (United States).',
        'setup.openAI': 'Відкрити Apple Intelligence',
        'setup.step2Title': 'Крок 2 з 3: увімкни Apple Intelligence',
        'setup.step2Body': 'Система вже англійською — це те, що потрібно.\n\n1. Відкрий Системні налаштування → ' +
            'Apple Intelligence & Siri й увімкни Apple Intelligence.\n2. Заразом перевір, що мова ' +
            'Siri — English (United States).\n3. Одразу після цього повернись до цього меню й ' +
            'натисни «Повернути мову…».\n\nЧерга й завантаження моделі тривають уже твоєю мовою — ' +
            'сидіти в англійській системі не потрібно, це перевірено. Відтепер перезавантажуйся ' +
            'лише звідси, поки Siri AI не з’явиться. Це може зайняти від кількох годин до доби.',
        'setup.startTitle': 'Перше налаштування: Siri AI ще не було?',
        'setup.startBody': 'Apple Intelligence ставить у чергу лише на англійській системі, і вирішується це під ' +
            'час завантаження. Тому перший крок роблять руками:\n\n1. Системні налаштування → ' +
            'Загальні → Мова й регіон: додай English (United States) і підніми вгору. Мову Siri ' +
            'теж постав English (United States).\n2. Перезавантаж звичайно, через меню Apple.\n3. ' +
            'Повернись до цього меню й натисни «Перше налаштування» ще раз — воно підкаже, що ' +
            'далі.\n\nЯкщо Siri AI у тебе вже працює, нічого цього не треба: просто ' +
            'перезавантажся через «Перезавантажити…».',
        'setup.openLanguage': 'Відкрити налаштування мови',

        'battery.enableTitle': 'Показувати відсоток заряду?',
        'battery.enableBody': 'У рядку меню з’являться число й акумулятор, як було до macOS 27. Системний ' +
            'акумулятор на цей час переїде в Пункт керування, щоб не було двох значків. Пункт ' +
            'керування на секунду перезапуститься, і значки блимнуть.\n\nНовий значок з’явиться ' +
            'ліворуч від системних. Щоб поставити його туди, де був акумулятор, перетягни його з ' +
            'натиснутим Cmd — місце запам’ятається.\n\nТой самий пункт меню вимикає його й ' +
            'повертає системний акумулятор.',
        'battery.enableButton': 'Показати',
        'battery.noneTitle': 'Акумулятора немає',
        'battery.noneBody': 'На цьому Mac показувати нічого.',

        'uninstall.title': 'Видалити AI Restart?',
        'uninstall.body': 'Мова системи повернеться на твою, запуск при вході вимкнеться, налаштування й ' +
            'журнали зітруться. Сама програма залишиться — перетягни її в Кошик сам.',
        'uninstall.button': 'Видалити',
        'uninstall.doneTitle': 'AI Restart видалено',
        'uninstall.doneBody': 'Лишилося перетягнути програму з «Програм» у Кошик.',

        'welcome.title': 'AI Restart встановлено',
        'welcome.body': 'Значок тепер у рядку меню праворуч — перезавантажуйся звідти.\n\nПерезавантажуй і ' +
            'вимикай Mac лише через нього: тоді Siri AI працює після завантаження, а мова системи ' +
            'сама повертається на твою.',

        'notify.ready': 'Enhanced Siri готова. Мову системи повернуто.',
        'notify.notReady': 'Siri AI не ввімкнулася цього разу. Мову повернуто — спробуй ще раз.',
        'notify.restored': 'Мову системи повернуто. Відтепер перезавантажуйся через AI Restart.',

        'error.title': 'AI Restart не спрацював',
        'error.installTitle': 'AI Restart не зміг встановитися',
        'error.bundle': 'Пошкоджений пакет: немає {name}',
        'error.busy': 'Інша дія AI Restart уже виконується — перезавантаження скасовано',
        'error.stuckApps': 'Ці програми не закрилися: {apps}.\nЗбережи в них зміни й спробуй ще раз.',
        'error.write': 'Не вдалося записати {path}',
        'error.exit': '{command} завершився з кодом {code}: {details}',
        'error.prefsRead': 'Не вдалося прочитати глобальні налаштування',
        'error.prefsVerify': 'Глобальні налаштування не прочиталися назад',
        'error.chooseLanguage': 'Система англійською: обери мову повернення',
        'error.noLanguageChosen': 'Мову не обрано — без неї кнопка не поверне твою мову',
        'error.agent': 'Не вдалося увімкнути запуск при вході: {details}',
        'error.otherBoot': 'Відкат належить іншому завантаженню',
        'error.unfinished': 'Незавершена дія: спершу поверни мову через «Повернути мову…»',
        'error.alreadyEnglish': 'Мова системи вже англійська — спершу поверни свою мову через AI Restart',
        'error.markerNoOperation': 'Мітка очікування без дії — відновлювати нічого',
        'error.notEnglishBoot': 'Англійські налаштування не активні — це не англійське завантаження',
        'error.neverRun': 'Немає збереженої мови — AI Restart ще жодного разу не працював',
        'error.noTarget': 'Немає збереженої мови повернення — відкрий налаштування програми',

        'guide.file': 'Guide.txt'
    },

    cs: {
        'common.ok': 'Rozumím',
        'common.cancel': 'Zrušit',
        'common.openSettings': 'Otevřít Nastavení',

        'menu.restart': 'Restartovat…',
        'menu.shutdown': 'Vypnout…',
        'menu.chatgpt': 'Připojit ChatGPT…',
        'menu.language': 'Vrátit jazyk…',
        'menu.setup': 'První nastavení',
        'menu.settings': 'Nastavení',
        'menu.guide': 'Návod',
        'menu.quit': 'Ukončit',
        'menu.uninstall': 'Odinstalovat AI Restart',
        'menu.battery': 'Procento baterie v řádku nabídek',
        'menu.batteryAsMain': 'Procento otevírá nabídku AI Restart',
        'menu.style': 'Vzhled ikony',
        'menu.styleModern': 'Jako v macOS 27',
        'menu.styleClassic': 'Jako v macOS 26',
        'menu.lowLevel': 'Nízká baterie',
        'menu.uiLanguage': 'Jazyk rozhraní',
        'menu.uiAuto': 'Podle systému',
        'menu.batteryDetails': 'Baterie',
        'menu.batterySettings': 'Režim nízké spotřeby a nastavení…',
        'menu.batteryOff': 'Skrýt procento z řádku nabídek',
        'menu.busy': 'Nejvíce spotřebovávají:',
        'menu.capacity': 'Kapacita: {capacity} · Cyklů: {cycles}',
        'menu.chargeUnknown': 'Neznámý stav nabití',

        'battery.charged': 'Baterie nabitá',
        'battery.charging': 'Nabíjení',
        'battery.chargingTime': 'Do plného nabití: {time}',
        'battery.ac': 'Napájecí adaptér',
        'battery.remaining': 'Zbývá: {time}',
        'battery.calculating': 'Zbývá: počítám…',
        'battery.hours': '{count}\u00a0h ',
        'battery.minutes': '{count}\u00a0min',
        'battery.lowNotice': 'Baterie na {level}\u00a0%. Režim nízké spotřeby zapnete takto: ikona AI\u00a0Restart ' +
            '→ „Baterie“ → „Režim nízké spotřeby a nastavení…“.',

        'leave.restartTitle': 'Opravdu chcete restartovat počítač?',
        'leave.shutdownTitle': 'Opravdu chcete vypnout počítač?',
        'leave.restartCountdown': 'Pokud nic neuděláte, počítač se automaticky restartuje za {seconds}.',
        'leave.shutdownCountdown': 'Pokud nic neuděláte, počítač se automaticky vypne za {seconds}.',
        'leave.restartButton': 'Restartovat',
        'leave.shutdownButton': 'Vypnout',
        'leave.reopen': 'Po přihlášení znovu otevřít okna',

        'chatgpt.title': 'Připojit ChatGPT a restartovat počítač?',
        'chatgpt.body': 'Po přihlášení zůstane systém chvíli v angličtině a otevře nastavení Siri: zapněte ' +
            'ChatGPT, přihlaste se a stiskněte Done. Přihlášení funguje jen v anglickém systému — ' +
            've vašem jazyce považuje macOS ChatGPT za nedostupný.',
        'chatgpt.setup': 'Připojuji ChatGPT. Dokud je systém ještě v angličtině:\n\n1. V otevřeném nastavení ' +
            'Apple Intelligence & Siri najděte ChatGPT (sekce Extensions).\n2. Zapněte rozšíření, ' +
            'stiskněte Sign In a přihlaste se ke svému účtu.\n3. Stiskněte Done — váš jazyk se ' +
            'vrátí.\n\nPotom bude v nastavení opět „Sign In…“. To je normální, NEMAČKEJTE to: ' +
            'ChatGPT v Siri už pod vaším účtem funguje.',
        'chatgpt.skip': 'Přeskočit',
        'chatgpt.done': 'Hotovo',
        'chatgpt.notEnabled': 'ChatGPT není v nastavení zapnutý — spusťte připojení znovu.',

        'language.title': 'Vrátit jazyk: {language}?',
        'language.body': 'Systém je teď v angličtině — přesně tak Apple Intelligence zapíná Siri AI. Jakmile ' +
            'Siri AI funguje, přepněte zpět svůj jazyk: restart není potřeba, programy se v něm ' +
            'znovu otevřou.\n\nOd teď restartujte Mac jen tlačítkem AI Restart, jinak se Siri AI ' +
            'nezapne.',
        'language.button': 'Vrátit jazyk',
        'language.alreadyTitle': 'Jazyk už je váš',
        'language.alreadyBody': 'Systém není v angličtině, není co vracet.',
        'language.ask': 'Systém je teď v angličtině. Do jakého jazyka se má po restartu vrátit?',

        'setup.doneTitle': 'První nastavení je už hotové',
        'setup.doneBody': 'Apple Intelligence už na tomto Macu je: Siri AI se zapne po restartu odsud, není co ' +
            'nastavovat.\n\nPokud se Siri AI stále neobjevuje, zkontrolujte jazyk Siri — musí být ' +
            'English (United States).',
        'setup.openAI': 'Otevřít Apple Intelligence',
        'setup.step2Title': 'Krok 2 ze 3: zapněte Apple Intelligence',
        'setup.step2Body': 'Systém už je v angličtině — přesně to potřebujeme.\n\n1. Otevřete Nastavení systému ' +
            '→ Apple Intelligence & Siri a zapněte Apple Intelligence.\n2. Zároveň ověřte, že ' +
            'jazyk Siri je English (United States).\n3. Hned poté se vraťte do této nabídky a ' +
            'stiskněte „Vrátit jazyk…“.\n\nČekací listina i stahování modelu pokračují už ve ' +
            'vašem jazyce — sedět v anglickém systému není potřeba, je to ověřené. Od té chvíle ' +
            'restartujte jen odsud, dokud se Siri AI neobjeví. Může to trvat od několika hodin do ' +
            'celého dne.',
        'setup.startTitle': 'První nastavení: Siri AI jste ještě neměli?',
        'setup.startBody': 'Apple Intelligence zařadí na čekací listinu jen v anglickém systému a rozhoduje se ' +
            'to při startu. První krok se proto dělá ručně:\n\n1. Nastavení systému → Obecné → ' +
            'Jazyk a oblast: přidejte English (United States) a přesuňte nahoru. Jazyk Siri ' +
            'nastavte také na English (United States).\n2. Restartujte běžně, z nabídky ' +
            'Apple.\n3. Vraťte se do této nabídky a stiskněte „První nastavení“ znovu — poradí, ' +
            'co dál.\n\nPokud vám Siri AI už funguje, nic z toho není potřeba: stačí restartovat ' +
            'přes „Restartovat…“.',
        'setup.openLanguage': 'Otevřít nastavení jazyka',

        'battery.enableTitle': 'Zobrazit procento baterie?',
        'battery.enableBody': 'V řádku nabídek se objeví číslo a baterie, jako to bylo před macOS 27. Systémová ' +
            'baterie se mezitím přesune do Ovládacího centra, aby nebyly dvě ikony. Ovládací ' +
            'centrum se na chvíli restartuje a ikony bliknou.\n\nNová ikona se objeví vlevo od ' +
            'systémových. Chcete-li ji dát tam, kde byla baterie, přetáhněte ji se stisknutým Cmd ' +
            '— místo se zapamatuje.\n\nStejná položka nabídky ji vypne a vrátí systémovou ' +
            'baterii.',
        'battery.enableButton': 'Zobrazit',
        'battery.noneTitle': 'Žádná baterie',
        'battery.noneBody': 'Na tomto Macu není co zobrazit.',

        'uninstall.title': 'Odinstalovat AI Restart?',
        'uninstall.body': 'Jazyk systému se vrátí na váš, spouštění při přihlášení se vypne, nastavení a ' +
            'záznamy se smažou. Samotný program zůstane — přetáhněte ho do Koše sami.',
        'uninstall.button': 'Odinstalovat',
        'uninstall.doneTitle': 'AI Restart odinstalován',
        'uninstall.doneBody': 'Zbývá jen přetáhnout program z Aplikací do Koše.',

        'welcome.title': 'AI Restart nainstalován',
        'welcome.body': 'Ikona je teď v řádku nabídek vpravo — odtud restartujte.\n\nRestartujte a vypínejte ' +
            'Mac jen přes ni: pak Siri AI funguje po startu a jazyk systému se sám vrátí na váš.',

        'notify.ready': 'Enhanced Siri je připravená. Jazyk systému vrácen.',
        'notify.notReady': 'Siri AI se při tomto startu nezapnula. Jazyk vrácen — zkuste to znovu.',
        'notify.restored': 'Jazyk systému vrácen. Od teď restartujte přes AI Restart.',

        'error.title': 'AI Restart selhal',
        'error.installTitle': 'AI Restart se nedokázal nainstalovat',
        'error.bundle': 'Poškozený balík: chybí {name}',
        'error.busy': 'Jiná operace AI Restart už běží — restart zrušen',
        'error.stuckApps': 'Tyto programy se nezavřely: {apps}.\nUložte v nich změny a zkuste to znovu.',
        'error.write': 'Nepodařilo se zapsat {path}',
        'error.exit': '{command} skončil s kódem {code}: {details}',
        'error.prefsRead': 'Nepodařilo se přečíst globální nastavení',
        'error.prefsVerify': 'Globální nastavení se nenačetlo zpět',
        'error.chooseLanguage': 'Systém je v angličtině: vyberte jazyk návratu',
        'error.noLanguageChosen': 'Jazyk nebyl vybrán — bez něj tlačítko váš jazyk nevrátí',
        'error.agent': 'Nepodařilo se zapnout spouštění při přihlášení: {details}',
        'error.otherBoot': 'Vrácení patří k jinému spuštění systému',
        'error.unfinished': 'Nedokončená operace: nejdřív vraťte jazyk přes „Vrátit jazyk…“',
        'error.alreadyEnglish': 'Jazyk systému už je anglický — nejdřív vraťte svůj jazyk přes AI Restart',
        'error.markerNoOperation': 'Značka čekání bez operace — není co obnovovat',
        'error.notEnglishBoot': 'Anglické předvolby nejsou aktivní — tohle není anglické spuštění',
        'error.neverRun': 'Není uložený jazyk — AI Restart ještě nikdy neběžel',
        'error.noTarget': 'Není uložený jazyk návratu — otevřete nastavení programu',

        'guide.file': 'Guide.txt'
    },

    el: {
        'common.ok': 'Εντάξει',
        'common.cancel': 'Ακύρωση',
        'common.openSettings': 'Άνοιγμα ρυθμίσεων',

        'menu.restart': 'Επανεκκίνηση…',
        'menu.shutdown': 'Τερματισμός…',
        'menu.chatgpt': 'Σύνδεση ChatGPT…',
        'menu.language': 'Επαναφορά γλώσσας…',
        'menu.setup': 'Πρώτη ρύθμιση',
        'menu.settings': 'Ρυθμίσεις',
        'menu.guide': 'Οδηγίες',
        'menu.quit': 'Έξοδος',
        'menu.uninstall': 'Κατάργηση του AI Restart',
        'menu.battery': 'Ποσοστό μπαταρίας στη γραμμή μενού',
        'menu.batteryAsMain': 'Το ποσοστό ανοίγει το μενού AI Restart',
        'menu.style': 'Εμφάνιση εικονιδίου',
        'menu.styleModern': 'Όπως στο macOS 27',
        'menu.styleClassic': 'Όπως στο macOS 26',
        'menu.lowLevel': 'Χαμηλή μπαταρία',
        'menu.uiLanguage': 'Γλώσσα περιβάλλοντος',
        'menu.uiAuto': 'Όπως το σύστημα',
        'menu.batteryDetails': 'Μπαταρία',
        'menu.batterySettings': 'Λειτουργία χαμηλής κατανάλωσης και ρυθμίσεις…',
        'menu.batteryOff': 'Απόκρυψη ποσοστού από τη γραμμή μενού',
        'menu.busy': 'Καταναλώνουν την περισσότερη ενέργεια:',
        'menu.capacity': 'Χωρητικότητα: {capacity} · Κύκλοι: {cycles}',
        'menu.chargeUnknown': 'Άγνωστη φόρτιση',

        'battery.charged': 'Η μπαταρία φορτίστηκε',
        'battery.charging': 'Φόρτιση',
        'battery.chargingTime': 'Μέχρι την πλήρη φόρτιση: {time}',
        'battery.ac': 'Τροφοδοτικό',
        'battery.remaining': 'Απομένουν: {time}',
        'battery.calculating': 'Απομένουν: υπολογισμός…',
        'battery.hours': '{count}\u00a0ώ ',
        'battery.minutes': '{count}\u00a0λ',
        'battery.lowNotice': 'Μπαταρία στο {level}\u00a0%. Για να ενεργοποιήσετε τη λειτουργία χαμηλής ' +
            'κατανάλωσης: εικονίδιο AI\u00a0Restart → «Μπαταρία» → «Λειτουργία χαμηλής ' +
            'κατανάλωσης και ρυθμίσεις…».',

        'leave.restartTitle': 'Σίγουρα θέλετε να κάνετε επανεκκίνηση του υπολογιστή;',
        'leave.shutdownTitle': 'Σίγουρα θέλετε να τερματίσετε τον υπολογιστή;',
        'leave.restartCountdown': 'Αν δεν κάνετε τίποτα, ο υπολογιστής θα επανεκκινήσει αυτόματα σε {seconds}.',
        'leave.shutdownCountdown': 'Αν δεν κάνετε τίποτα, ο υπολογιστής θα τερματιστεί αυτόματα σε {seconds}.',
        'leave.restartButton': 'Επανεκκίνηση',
        'leave.shutdownButton': 'Τερματισμός',
        'leave.reopen': 'Άνοιγμα ξανά των παραθύρων μετά τη σύνδεση',

        'chatgpt.title': 'Σύνδεση του ChatGPT και επανεκκίνηση του υπολογιστή;',
        'chatgpt.body': 'Μετά τη σύνδεση το σύστημα μένει για λίγο στα αγγλικά και ανοίγει τις ρυθμίσεις ' +
            'Siri: ενεργοποιήστε το ChatGPT, συνδεθείτε και πατήστε Done. Η σύνδεση δουλεύει μόνο ' +
            'σε αγγλικό σύστημα — στη γλώσσα σας το macOS θεωρεί το ChatGPT μη διαθέσιμο.',
        'chatgpt.setup': 'Σύνδεση ChatGPT. Όσο το σύστημα είναι ακόμη στα αγγλικά:\n\n1. Στις ρυθμίσεις Apple ' +
            'Intelligence & Siri που άνοιξαν, βρείτε το ChatGPT (ενότητα Extensions).\n2. ' +
            'Ενεργοποιήστε την επέκταση, πατήστε Sign In και συνδεθείτε στον λογαριασμό σας.\n3. ' +
            'Πατήστε Done — η γλώσσα σας θα επιστρέψει.\n\nΜετά οι ρυθμίσεις θα δείχνουν πάλι ' +
            '«Sign In…». Είναι φυσιολογικό, ΜΗΝ το πατήσετε: το ChatGPT στη Siri ήδη δουλεύει με ' +
            'τον λογαριασμό σας.',
        'chatgpt.skip': 'Παράλειψη',
        'chatgpt.done': 'Έτοιμο',
        'chatgpt.notEnabled': 'Το ChatGPT δεν είναι ενεργοποιημένο στις ρυθμίσεις — ξεκινήστε τη σύνδεση από την ' +
            'αρχή.',

        'language.title': 'Επαναφορά γλώσσας: {language};',
        'language.body': 'Το σύστημα είναι τώρα στα αγγλικά — έτσι ακριβώς ενεργοποιεί το Apple Intelligence ' +
            'τη Siri AI. Μόλις η Siri AI δουλέψει, γυρίστε στη γλώσσα σας: δεν χρειάζεται ' +
            'επανεκκίνηση, οι εφαρμογές θα ανοίξουν ξανά σε αυτήν.\n\nΑπό εδώ και πέρα κάντε ' +
            'επανεκκίνηση του Mac μόνο με το κουμπί AI Restart, αλλιώς η Siri AI δεν θα ' +
            'ενεργοποιηθεί.',
        'language.button': 'Επαναφορά γλώσσας',
        'language.alreadyTitle': 'Η γλώσσα είναι ήδη η δική σας',
        'language.alreadyBody': 'Το σύστημα δεν είναι στα αγγλικά, δεν υπάρχει τίποτα να επαναφερθεί.',
        'language.ask': 'Το σύστημα είναι τώρα στα αγγλικά. Σε ποια γλώσσα να επιστρέψει μετά την ' +
            'επανεκκίνηση;',

        'setup.doneTitle': 'Η πρώτη ρύθμιση έχει ήδη γίνει',
        'setup.doneBody': 'Το Apple Intelligence έχει ήδη φτάσει σε αυτό το Mac: η Siri AI ενεργοποιείται μετά ' +
            'από επανεκκίνηση από εδώ, δεν υπάρχει τίποτα να ρυθμιστεί.\n\nΑν η Siri AI ' +
            'εξακολουθεί να μην εμφανίζεται, ελέγξτε τη γλώσσα της Siri — πρέπει να είναι English ' +
            '(United States).',
        'setup.openAI': 'Άνοιγμα Apple Intelligence',
        'setup.step2Title': 'Βήμα 2 από 3: ενεργοποιήστε το Apple Intelligence',
        'setup.step2Body': 'Το σύστημα είναι ήδη στα αγγλικά — αυτό ακριβώς χρειαζόμαστε.\n\n1. Ανοίξτε ' +
            'Ρυθμίσεις συστήματος → Apple Intelligence & Siri και ενεργοποιήστε το Apple ' +
            'Intelligence.\n2. Με την ευκαιρία, βεβαιωθείτε ότι η γλώσσα της Siri είναι English ' +
            '(United States).\n3. Αμέσως μετά επιστρέψτε σε αυτό το μενού και πατήστε «Επαναφορά ' +
            'γλώσσας…».\n\nΗ λίστα αναμονής και η λήψη του μοντέλου συνεχίζονται στη δική σας ' +
            'γλώσσα — δεν χρειάζεται να μείνετε σε αγγλικό σύστημα, έχει δοκιμαστεί. Από εκεί και ' +
            'πέρα κάντε επανεκκίνηση μόνο από εδώ, μέχρι να εμφανιστεί η Siri AI. Μπορεί να πάρει ' +
            'από μερικές ώρες έως μία ημέρα.',
        'setup.startTitle': 'Πρώτη ρύθμιση: δεν είχατε ποτέ Siri AI;',
        'setup.startBody': 'Το Apple Intelligence σάς βάζει στη λίστα αναμονής μόνο όταν το σύστημα είναι στα ' +
            'αγγλικά, και αυτό κρίνεται κατά την εκκίνηση. Γι αυτό το πρώτο βήμα γίνεται με το ' +
            'χέρι:\n\n1. Ρυθμίσεις συστήματος → Γενικά → Γλώσσα και περιοχή: προσθέστε English ' +
            '(United States) και μετακινήστε το στην κορυφή. Ορίστε και τη γλώσσα της Siri σε ' +
            'English (United States).\n2. Κάντε επανεκκίνηση με τον συνηθισμένο τρόπο, από το ' +
            'μενού Apple.\n3. Επιστρέψτε σε αυτό το μενού και πατήστε ξανά «Πρώτη ρύθμιση» — θα ' +
            'σας πει τι ακολουθεί.\n\nΑν η Siri AI ήδη δουλεύει, τίποτα από αυτά δεν χρειάζεται: ' +
            'απλώς κάντε επανεκκίνηση με «Επανεκκίνηση…».',
        'setup.openLanguage': 'Άνοιγμα ρυθμίσεων γλώσσας',

        'battery.enableTitle': 'Να εμφανίζεται το ποσοστό μπαταρίας;',
        'battery.enableBody': 'Στη γραμμή μενού θα εμφανιστεί ένας αριθμός και μια μπαταρία, όπως ήταν πριν από το ' +
            'macOS 27. Η μπαταρία του συστήματος μετακινείται στο μεταξύ στο Κέντρο ελέγχου, ώστε ' +
            'να μην υπάρχουν δύο εικονίδια. Το Κέντρο ελέγχου επανεκκινεί για ένα δευτερόλεπτο ' +
            'και τα εικονίδια αναβοσβήνουν.\n\nΤο νέο εικονίδιο εμφανίζεται αριστερά από τα ' +
            'συστημικά. Για να το βάλετε εκεί που ήταν η μπαταρία, σύρετέ το κρατώντας το Cmd — η ' +
            'θέση απομνημονεύεται.\n\nΤο ίδιο στοιχείο μενού το απενεργοποιεί και επαναφέρει τη ' +
            'μπαταρία του συστήματος.',
        'battery.enableButton': 'Εμφάνιση',
        'battery.noneTitle': 'Δεν υπάρχει μπαταρία',
        'battery.noneBody': 'Σε αυτό το Mac δεν υπάρχει τίποτα να εμφανιστεί.',

        'uninstall.title': 'Κατάργηση του AI Restart;',
        'uninstall.body': 'Η γλώσσα του συστήματος θα επανέλθει στη δική σας, η εκκίνηση κατά τη σύνδεση θα ' +
            'απενεργοποιηθεί, οι ρυθμίσεις και τα αρχεία καταγραφής θα διαγραφούν. Η ίδια η ' +
            'εφαρμογή παραμένει — σύρετέ την στα Απορρίμματα μόνοι σας.',
        'uninstall.button': 'Κατάργηση',
        'uninstall.doneTitle': 'Το AI Restart καταργήθηκε',
        'uninstall.doneBody': 'Απομένει μόνο να σύρετε την εφαρμογή από τις Εφαρμογές στα Απορρίμματα.',

        'welcome.title': 'Το AI Restart εγκαταστάθηκε',
        'welcome.body': 'Το εικονίδιο βρίσκεται τώρα δεξιά στη γραμμή μενού — από εκεί κάντε ' +
            'επανεκκίνηση.\n\nΚάντε επανεκκίνηση και τερματισμό του Mac μόνο μέσω αυτού: τότε η ' +
            'Siri AI δουλεύει μετά την εκκίνηση και η γλώσσα του συστήματος επιστρέφει μόνη της ' +
            'στη δική σας.',

        'notify.ready': 'Η Enhanced Siri είναι έτοιμη. Η γλώσσα του συστήματος επανήλθε.',
        'notify.notReady': 'Η Siri AI δεν ενεργοποιήθηκε σε αυτή την εκκίνηση. Η γλώσσα επανήλθε — δοκιμάστε ' +
            'ξανά.',
        'notify.restored': 'Η γλώσσα του συστήματος επανήλθε. Από εδώ και πέρα κάντε επανεκκίνηση μέσω του AI ' +
            'Restart.',

        'error.title': 'Το AI Restart απέτυχε',
        'error.installTitle': 'Το AI Restart δεν μπόρεσε να εγκατασταθεί',
        'error.bundle': 'Κατεστραμμένο πακέτο: λείπει το {name}',
        'error.busy': 'Εκτελείται ήδη άλλη ενέργεια του AI Restart — η επανεκκίνηση ακυρώθηκε',
        'error.stuckApps': 'Αυτές οι εφαρμογές δεν έκλεισαν: {apps}.\nΑποθηκεύστε τις αλλαγές σας εκεί και ' +
            'δοκιμάστε ξανά.',
        'error.write': 'Δεν ήταν δυνατή η εγγραφή του {path}',
        'error.exit': 'Το {command} τερματίστηκε με κωδικό {code}: {details}',
        'error.prefsRead': 'Δεν ήταν δυνατή η ανάγνωση των καθολικών ρυθμίσεων',
        'error.prefsVerify': 'Οι καθολικές ρυθμίσεις δεν διαβάστηκαν ξανά',
        'error.chooseLanguage': 'Το σύστημα είναι στα αγγλικά: επιλέξτε γλώσσα επιστροφής',
        'error.noLanguageChosen': 'Δεν επιλέχθηκε γλώσσα — χωρίς αυτήν το κουμπί δεν μπορεί να επαναφέρει τη γλώσσα σας',
        'error.agent': 'Δεν ήταν δυνατή η ενεργοποίηση της εκκίνησης κατά τη σύνδεση: {details}',
        'error.otherBoot': 'Η επαναφορά ανήκει σε άλλη εκκίνηση',
        'error.unfinished': 'Ημιτελής ενέργεια: επαναφέρετε πρώτα τη γλώσσα σας με «Επαναφορά γλώσσας…»',
        'error.alreadyEnglish': 'Η γλώσσα του συστήματος είναι ήδη αγγλικά — επαναφέρετε πρώτα τη γλώσσα σας μέσω του ' +
            'AI Restart',
        'error.markerNoOperation': 'Σήμανση αναμονής χωρίς ενέργεια — δεν υπάρχει τίποτα να επαναφερθεί',
        'error.notEnglishBoot': 'Οι αγγλικές προτιμήσεις δεν είναι ενεργές — αυτή δεν είναι αγγλική εκκίνηση',
        'error.neverRun': 'Δεν υπάρχει αποθηκευμένη γλώσσα — το AI Restart δεν έχει τρέξει ποτέ',
        'error.noTarget': 'Δεν υπάρχει αποθηκευμένη γλώσσα επιστροφής — ανοίξτε τις ρυθμίσεις της εφαρμογής',

        'guide.file': 'Guide.txt'
    },

    ro: {
        'common.ok': 'Am înțeles',
        'common.cancel': 'Anulează',
        'common.openSettings': 'Deschide Configurări',

        'menu.restart': 'Repornește…',
        'menu.shutdown': 'Oprește…',
        'menu.chatgpt': 'Conectează ChatGPT…',
        'menu.language': 'Restabilește limba…',
        'menu.setup': 'Prima configurare',
        'menu.settings': 'Configurări',
        'menu.guide': 'Instrucțiuni',
        'menu.quit': 'Ieșire',
        'menu.uninstall': 'Dezinstalează AI Restart',
        'menu.battery': 'Procentul bateriei în bara de meniu',
        'menu.batteryAsMain': 'Procentul deschide meniul AI Restart',
        'menu.style': 'Aspectul pictogramei',
        'menu.styleModern': 'Ca în macOS 27',
        'menu.styleClassic': 'Ca în macOS 26',
        'menu.lowLevel': 'Baterie scăzută',
        'menu.uiLanguage': 'Limba interfeței',
        'menu.uiAuto': 'Ca în sistem',
        'menu.batteryDetails': 'Baterie',
        'menu.batterySettings': 'Mod consum redus și configurări…',
        'menu.batteryOff': 'Ascunde procentul din bara de meniu',
        'menu.busy': 'Consumă cel mai mult:',
        'menu.capacity': 'Capacitate: {capacity} · Cicluri: {cycles}',
        'menu.chargeUnknown': 'Nivel de încărcare necunoscut',

        'battery.charged': 'Baterie încărcată',
        'battery.charging': 'Se încarcă',
        'battery.chargingTime': 'Până la încărcarea completă: {time}',
        'battery.ac': 'Alimentare de la rețea',
        'battery.remaining': 'Timp rămas: {time}',
        'battery.calculating': 'Timp rămas: se calculează…',
        'battery.hours': '{count}\u00a0h ',
        'battery.minutes': '{count}\u00a0min',
        'battery.lowNotice': 'Baterie la {level}\u00a0%. Pentru a activa modul consum redus: pictograma ' +
            'AI\u00a0Restart → „Baterie” → „Mod consum redus și configurări…”.',

        'leave.restartTitle': 'Sigur doriți să reporniți computerul?',
        'leave.shutdownTitle': 'Sigur doriți să opriți computerul?',
        'leave.restartCountdown': 'Dacă nu faceți nimic, computerul va reporni automat în {seconds}.',
        'leave.shutdownCountdown': 'Dacă nu faceți nimic, computerul se va opri automat în {seconds}.',
        'leave.restartButton': 'Repornește',
        'leave.shutdownButton': 'Oprește',
        'leave.reopen': 'Redeschide ferestrele după autentificare',

        'chatgpt.title': 'Conectați ChatGPT și reporniți computerul?',
        'chatgpt.body': 'După autentificare sistemul rămâne puțin în engleză și deschide configurările Siri: ' +
            'activați ChatGPT, autentificați-vă și apăsați Done. Autentificarea funcționează doar ' +
            'cât sistemul este în engleză — în limba dumneavoastră macOS consideră ChatGPT ' +
            'indisponibil.',
        'chatgpt.setup': 'Se conectează ChatGPT. Cât timp sistemul este încă în engleză:\n\n1. În ' +
            'configurările Apple Intelligence & Siri tocmai deschise, găsiți ChatGPT (secțiunea ' +
            'Extensions).\n2. Activați extensia, apăsați Sign In și autentificați-vă în cont.\n3. ' +
            'Apăsați Done — limba dumneavoastră va reveni.\n\nApoi configurările vor afișa din ' +
            'nou „Sign In…”. Este normal, NU apăsați: ChatGPT în Siri funcționează deja cu contul ' +
            'dumneavoastră.',
        'chatgpt.skip': 'Omite',
        'chatgpt.done': 'Gata',
        'chatgpt.notEnabled': 'ChatGPT nu este activat în configurări — reluați conectarea.',

        'language.title': 'Restabiliți limba: {language}?',
        'language.body': 'Sistemul este acum în engleză — exact așa activează Apple Intelligence Siri AI. ' +
            'Odată ce Siri AI funcționează, reveniți la limba dumneavoastră: nu este nevoie de ' +
            'repornire, aplicațiile se vor redeschide în ea.\n\nDe acum înainte reporniți Mac-ul ' +
            'doar cu butonul AI Restart, altfel Siri AI nu se va activa.',
        'language.button': 'Restabilește limba',
        'language.alreadyTitle': 'Limba este deja a dumneavoastră',
        'language.alreadyBody': 'Sistemul nu este în engleză, nu este nimic de restabilit.',
        'language.ask': 'Sistemul este acum în engleză. La ce limbă să revină după repornire?',

        'setup.doneTitle': 'Prima configurare este deja făcută',
        'setup.doneBody': 'Apple Intelligence a ajuns deja pe acest Mac: Siri AI se activează după o repornire ' +
            'de aici, nu este nimic de configurat.\n\nDacă Siri AI tot nu apare, verificați limba ' +
            'Siri — trebuie să fie English (United States).',
        'setup.openAI': 'Deschide Apple Intelligence',
        'setup.step2Title': 'Pasul 2 din 3: activați Apple Intelligence',
        'setup.step2Body': 'Sistemul este deja în engleză — exact ce ne trebuie.\n\n1. Deschideți Configurări ' +
            'sistem → Apple Intelligence & Siri și activați Apple Intelligence.\n2. Tot acolo, ' +
            'asigurați-vă că limba Siri este English (United States).\n3. Imediat după aceea ' +
            'reveniți la acest meniu și apăsați „Restabilește limba…”.\n\nLista de așteptare și ' +
            'descărcarea modelului continuă în limba dumneavoastră — nu trebuie să stați într-un ' +
            'sistem în engleză, este verificat. De atunci reporniți doar de aici, până când apare ' +
            'Siri AI. Poate dura de la câteva ore la o zi.',
        'setup.startTitle': 'Prima configurare: încă nu aveți Siri AI?',
        'setup.startBody': 'Apple Intelligence vă pune pe lista de așteptare doar cât sistemul este în engleză, ' +
            'iar asta se decide la pornire. De aceea primul pas se face manual:\n\n1. Configurări ' +
            'sistem → General → Limbă și regiune: adăugați English (United States) și mutați-l în ' +
            'vârf. Setați și limba Siri pe English (United States).\n2. Reporniți obișnuit, din ' +
            'meniul Apple.\n3. Reveniți la acest meniu și apăsați din nou „Prima configurare” — ' +
            'vă va spune ce urmează.\n\nDacă Siri AI vă funcționează deja, nimic din toate ' +
            'acestea nu este necesar: reporniți pur și simplu cu „Repornește…”.',
        'setup.openLanguage': 'Deschide configurările de limbă',

        'battery.enableTitle': 'Afișați procentul bateriei?',
        'battery.enableBody': 'În bara de meniu vor apărea un număr și o baterie, așa cum era înainte de macOS 27. ' +
            'Bateria sistemului se mută între timp în Centrul de control, ca să nu fie două ' +
            'pictograme. Centrul de control repornește pentru o secundă și pictogramele ' +
            'clipesc.\n\nNoua pictogramă apare în stânga celor de sistem. Ca să o puneți unde era ' +
            'bateria, trageți-o ținând apăsat Cmd — locul este memorat.\n\nAceeași opțiune din ' +
            'meniu o dezactivează și readuce bateria sistemului.',
        'battery.enableButton': 'Afișează',
        'battery.noneTitle': 'Nicio baterie',
        'battery.noneBody': 'Pe acest Mac nu este nimic de afișat.',

        'uninstall.title': 'Dezinstalați AI Restart?',
        'uninstall.body': 'Limba sistemului va fi restabilită, pornirea la autentificare va fi dezactivată, ' +
            'configurările și jurnalele vor fi șterse. Aplicația rămâne — trageți-o singur în ' +
            'Coș.',
        'uninstall.button': 'Dezinstalează',
        'uninstall.doneTitle': 'AI Restart dezinstalat',
        'uninstall.doneBody': 'Mai rămâne doar să trageți aplicația din Aplicații în Coș.',

        'welcome.title': 'AI Restart instalat',
        'welcome.body': 'Pictograma este acum în bara de meniu, în dreapta — de acolo reporniți.\n\nReporniți ' +
            'și opriți Mac-ul doar prin ea: atunci Siri AI funcționează după pornire, iar limba ' +
            'sistemului revine singură la a dumneavoastră.',

        'notify.ready': 'Enhanced Siri este gata. Limba sistemului a fost restabilită.',
        'notify.notReady': 'Siri AI nu s-a activat la această pornire. Limba a fost restabilită — încercați din ' +
            'nou.',
        'notify.restored': 'Limba sistemului a fost restabilită. De acum reporniți prin AI Restart.',

        'error.title': 'AI Restart a eșuat',
        'error.installTitle': 'AI Restart nu s-a putut instala',
        'error.bundle': 'Pachet deteriorat: lipsește {name}',
        'error.busy': 'O altă operație AI Restart este deja în curs — repornirea a fost anulată',
        'error.stuckApps': 'Aceste aplicații nu s-au închis: {apps}.\nSalvați modificările în ele și încercați ' +
            'din nou.',
        'error.write': 'Nu s-a putut scrie {path}',
        'error.exit': '{command} s-a încheiat cu codul {code}: {details}',
        'error.prefsRead': 'Nu s-au putut citi configurările globale',
        'error.prefsVerify': 'Configurările globale nu s-au recitit',
        'error.chooseLanguage': 'Sistemul este în engleză: alegeți limba de revenire',
        'error.noLanguageChosen': 'Nu a fost aleasă nicio limbă — fără ea butonul nu vă poate restabili limba',
        'error.agent': 'Nu s-a putut activa pornirea la autentificare: {details}',
        'error.otherBoot': 'Revenirea aparține altei porniri',
        'error.unfinished': 'Operație neterminată: restabiliți mai întâi limba cu „Restabilește limba…”',
        'error.alreadyEnglish': 'Limba sistemului este deja engleza — restabiliți mai întâi limba dumneavoastră prin ' +
            'AI Restart',
        'error.markerNoOperation': 'Marcaj de așteptare fără operație — nu este nimic de restabilit',
        'error.notEnglishBoot': 'Preferințele în engleză nu sunt active — aceasta nu este o pornire în engleză',
        'error.neverRun': 'Nicio limbă salvată — AI Restart nu a rulat niciodată',
        'error.noTarget': 'Nicio limbă de revenire salvată — deschideți configurările aplicației',

        'guide.file': 'Guide.txt'
    }
};

var UI_FILE = 'ui.json';

// Порядок в меню «Язык интерфейса». Названия языков пишем на них самих: человек,
// который ищет свой язык, узнаёт его в списке независимо от текущего языка меню.
var UI_CHOICES = [
    { code: 'auto', name: null },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'uk', name: 'Українська' },
    { code: 'pl', name: 'Polski' },
    { code: 'cs', name: 'Čeština' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'ro', name: 'Română' }
];

var uiLang = null;

function savedUILanguage() {
    var saved = readJSON(statePath(UI_FILE));
    var code = saved && saved.language;
    return UI_TEXT[code] ? code : 'auto';
}

function setUILanguage(code) {
    writeJSON(statePath(UI_FILE), { language: UI_TEXT[code] ? code : 'auto' });
    uiLang = null;
}

// Из кода вида 'uk-UA' берём только сам язык: регион на выбор строк не влияет.
function matchLanguage(code) {
    var base = String(code || '').toLowerCase().split(/[-_]/)[0];
    return UI_TEXT[base] ? base : 'en';
}

function uiLanguage() {
    if (uiLang) return uiLang;
    var chosen = savedUILanguage();
    if (chosen !== 'auto') { uiLang = chosen; return uiLang; }
    var code = '';
    try {
        var target = savedTarget();
        code = (target && target.AppleLanguages && target.AppleLanguages[0]) || '';
    } catch (error) { /* настроек ещё нет — спросим систему */ }
    if (!code) {
        try { code = ObjC.unwrap($.NSLocale.preferredLanguages.objectAtIndex(0)); } catch (error) { code = ''; }
    }
    uiLang = matchLanguage(code);
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

// Счёт секунд: в славянских языках три формы, в остальных две.
// Формы стоят в винительном падеже — они подставляются в «через ...».
var SECOND_FORMS = {
    ru: ['секунду', 'секунды', 'секунд'],
    uk: ['секунду', 'секунди', 'секунд'],
    pl: ['sekundę', 'sekundy', 'sekund'],
    cs: ['sekundu', 'sekundy', 'sekund']
};

function secondsText(count) {
    var lang = uiLanguage();
    var forms = SECOND_FORMS[lang];
    if (forms) {
        var tail = count % 100, last = count % 10;
        var word = (tail >= 11 && tail <= 14) ? forms[2]
            : last === 1 ? forms[0]
            : (last >= 2 && last <= 4) ? forms[1] : forms[2];
        return count + ' ' + word;
    }
    if (lang === 'el') {
        return count + ' δευτερόλεπτ' +
            (count === 1 ? 'ο' : 'α');
    }
    // В румынском числа от двадцати требуют предлога: «20 de secunde».
    if (lang === 'ro') {
        var noun = count === 1 ? 'secundă' : (count % 100 >= 20 ? 'de secunde' : 'secunde');
        return count + ' ' + noun;
    }
    return count + ' second' + (count === 1 ? '' : 's');
}
