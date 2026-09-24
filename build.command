#!/bin/zsh
# Собирает «AI Restart.app» из src/ и упаковывает в dist/AI-Restart.dmg с окном-
# перетаскивателем. Приложение самодостаточно: логика лежит внутри бандла,
# зависимостей нет, нужен только macOS со встроенными osacompile и hdiutil.
set -e
cd "${0:A:h}"

NAME="AI Restart"
APP_ID="com.airestart.app"
VERSION="0.2"
BUILD="$(mktemp -d)"
OUT="${0:A:h}/dist"
# Без пробела: GitHub заменяет пробелы в именах файлов релиза на точки.
DMG="$OUT/AI-Restart.dmg"
mkdir -p "$OUT"

trap 'hdiutil detach "/Volumes/$NAME" -quiet -force 2>/dev/null; rm -rf "$BUILD"' EXIT

# --- приложение -------------------------------------------------------------

print "Собираю $NAME.app"
osacompile -l JavaScript -o "$BUILD/$NAME.app" "src/app.js"

PLIST="$BUILD/$NAME.app/Contents/Info.plist"
set_key() {
    /usr/libexec/PlistBuddy -c "Set :$1 $2" "$PLIST" 2>/dev/null \
        || /usr/libexec/PlistBuddy -c "Add :$1 $3 $2" "$PLIST"
}
set_key CFBundleIdentifier "$APP_ID" string
set_key CFBundleName "$NAME" string
set_key CFBundleShortVersionString "$VERSION" string
set_key CFBundleVersion "$VERSION" string
set_key LSMinimumSystemVersion "27.0" string
# Живёт в строке меню: без иконки в Dock и без переключения по Cmd+Tab.
/usr/libexec/PlistBuddy -c "Delete :LSUIElement" "$PLIST" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Add :LSUIElement bool true" "$PLIST"

# Своя иконка вместо стандартной иконки скрипта: без Assets.car macOS берёт applet.icns.
cp "src/AppIcon.icns" "$BUILD/$NAME.app/Contents/Resources/applet.icns"
rm -f "$BUILD/$NAME.app/Contents/Resources/Assets.car"
/usr/libexec/PlistBuddy -c "Delete :CFBundleIconName" "$PLIST" 2>/dev/null || true

print "Кладу модули внутрь бандла"
mkdir -p "$BUILD/$NAME.app/Contents/Resources/lib"
cp src/lib/*.js "$BUILD/$NAME.app/Contents/Resources/lib/"
cp "src/login.js" "$BUILD/$NAME.app/Contents/Resources/login.js"
cp "src/Инструкция.txt" "$BUILD/$NAME.app/Contents/Resources/Инструкция.txt"
cp "src/Guide.txt" "$BUILD/$NAME.app/Contents/Resources/Guide.txt"

codesign --force --deep -s - "$BUILD/$NAME.app" 2>/dev/null
xattr -cr "$BUILD/$NAME.app" 2>/dev/null || true

print "Проверяю синтаксис модулей"
for file in "$BUILD/$NAME.app/Contents/Resources/lib/"*.js "$BUILD/$NAME.app/Contents/Resources/login.js"; do
    if ! osacompile -l JavaScript -o /dev/null "$file" 2>/dev/null; then
        print "   ОШИБКА синтаксиса: ${file:t}"
        exit 1
    fi
done

# --- образ ------------------------------------------------------------------

print "Рисую фон окна"
STAGE="$BUILD/stage"
mkdir -p "$STAGE/.background"
osascript -l JavaScript "src/dmg-background.js" "$STAGE/.background/background.tiff" >/dev/null

cp -R "$BUILD/$NAME.app" "$STAGE/"
ln -s /Applications "$STAGE/Программы"

print "Собираю образ"
RW="$BUILD/rw.dmg"
hdiutil create -quiet -srcfolder "$STAGE" -volname "$NAME" -fs HFS+ \
    -format UDRW -size 40m "$RW"
# Монтируем обычным способом: с -nobrowse Finder не видит диск и раскладку не задать.
# Сначала убираем прошлое монтирование, иначе том встанет как «AI Restart 1»
# и Finder будет раскладывать не тот диск.
hdiutil detach "/Volumes/$NAME" -quiet -force 2>/dev/null || true
hdiutil attach -quiet "$RW"

# Раскладку окна умеет задавать только Finder. Если он не отвечает (не выдано
# разрешение на управление), образ всё равно соберётся — просто без оформления.
print "Расставляю окно"
if osascript <<APPLESCRIPT >/dev/null 2>&1
tell application "Finder"
    tell disk "$NAME"
        open
        set current view of container window to icon view
        set toolbar visible of container window to false
        set statusbar visible of container window to false
        set pathbar visible of container window to false
        set sidebar width of container window to 0
        set the bounds of container window to {300, 140, 800, 518}
        set viewOptions to the icon view options of container window
        set arrangement of viewOptions to not arranged
        set icon size of viewOptions to 96
        set text size of viewOptions to 12
        set background picture of viewOptions to file ".background:background.tiff"
        set position of item "$NAME.app" of container window to {125, 170}
        set position of item "Программы" of container window to {375, 170}
        update without registering applications
        delay 1
        close
    end tell
end tell
APPLESCRIPT
then
    print "   готово"
else
    print "   Finder не ответил — образ будет без оформления"
    print "   (разреши Терминалу управлять Finder: Настройки → Конфиденциальность → Автоматизация)"
fi

sync
hdiutil detach "/Volumes/$NAME" -quiet
rm -f "$DMG"
hdiutil convert -quiet "$RW" -format UDZO -imagekey zlib-level=9 -o "$DMG"

# Готовый бандл рядом не оставляем: две копии с одним bundle id путают Spotlight
# и можно случайно запустить не ту. Нужен для проверки — примонтируй DMG.
rm -rf "$OUT/$NAME.app"

print ""
print "Готово, версия $VERSION: $DMG"
print "SHA-256: $(shasum -a 256 "$DMG" | cut -d' ' -f1)"
