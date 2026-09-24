// dmg-background.js — рисует фон окна DMG. Запускается сборкой, результат кладётся
// в образ как .background/background.tiff (два масштаба: обычный и Retina).
// Фон СВЕТЛЫЙ намеренно: подписи под значками рисует Finder своим цветом, и он
// тёмный независимо от оформления системы. На тёмном фоне их просто не видно.
// Запуск: osascript -l JavaScript dmg-background.js /путь/к/background.tiff

ObjC.import('AppKit');
ObjC.import('Foundation');

var WIDTH = 500, HEIGHT = 350;
// Иконки в окне стоят по этим точкам (координаты Finder, начало — левый верхний угол).
var APP_X = 125, LINK_X = 375, ICON_Y = 170;

function color(r, g, b, a) {
    return $.NSColor.colorWithSRGBRedGreenBlueAlpha(r / 255, g / 255, b / 255, a === undefined ? 1 : a);
}

function drawText(text, size, weight, textColor, centerX, y) {
    var font = $.NSFont.systemFontOfSizeWeight(size, weight);
    var style = $.NSMutableParagraphStyle.alloc.init;
    style.alignment = $.NSTextAlignmentCenter;
    var attributes = $({ NSFont: font, NSColor: textColor, NSParagraphStyle: style });
    // NSAttributedString через мост не создаётся, зато NSString умеет рисовать сам.
    var width = Number($(text).sizeWithAttributes(attributes).width);
    $(text).drawAtPointWithAttributes($.NSMakePoint(centerX - width / 2, y), attributes);
}

// Стрелка от приложения к «Программам»: линия со скруглёнными концами и уголок.
function drawArrow(fromX, toX, y) {
    var path = $.NSBezierPath.bezierPath;
    path.lineWidth = 4;
    path.lineCapStyle = $.NSLineCapStyleRound;
    path.lineJoinStyle = $.NSLineJoinStyleRound;
    path.moveToPoint($.NSMakePoint(fromX, y));
    path.lineToPoint($.NSMakePoint(toX, y));
    path.moveToPoint($.NSMakePoint(toX - 13, y + 10));
    path.lineToPoint($.NSMakePoint(toX, y));
    path.lineToPoint($.NSMakePoint(toX - 13, y - 10));
    color(60, 60, 67, 0.40).set;
    path.stroke;
}

function renderInto(scale) {
    var pixelsWide = WIDTH * scale, pixelsHigh = HEIGHT * scale;
    var rep = $.NSBitmapImageRep.alloc.initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
        $(), pixelsWide, pixelsHigh, 8, 4, true, false, $.NSCalibratedRGBColorSpace, 0, 0);
    rep.size = $.NSMakeSize(WIDTH, HEIGHT);
    var context = $.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep);
    $.NSGraphicsContext.saveGraphicsState;
    $.NSGraphicsContext.setCurrentContext(context);

    // Фон: мягкий вертикальный градиент в светло-сером, как у системных окон.
    var gradient = $.NSGradient.alloc.initWithStartingColorEndingColor(
        color(247, 247, 249), color(228, 228, 234));
    gradient.drawInRectAngle($.NSMakeRect(0, 0, WIDTH, HEIGHT), 90);

    // Координаты Finder идут сверху вниз, у Cocoa — снизу вверх.
    var arrowY = HEIGHT - ICON_Y;
    drawArrow(APP_X + 78, LINK_X - 78, arrowY);

    drawText('AI Restart', 26, $.NSFontWeightSemibold, color(28, 28, 30), WIDTH / 2, HEIGHT - 62);
    drawText('Перетащи приложение в «Программы»', 13, $.NSFontWeightRegular,
        color(60, 60, 67, 0.65), WIDTH / 2, HEIGHT - 88);
    // Нижние 40 точек окна перекрывает плашка Finder, поэтому подписи держим выше.
    drawText('Потом запусти его: значок появится в строке меню', 11, $.NSFontWeightRegular,
        color(60, 60, 67, 0.55), WIDTH / 2, 78);
    drawText('Если macOS не даст открыть — Настройки → Конфиденциальность → «Всё равно открыть»',
        10, $.NSFontWeightRegular, color(60, 60, 67, 0.40), WIDTH / 2, 56);

    $.NSGraphicsContext.restoreGraphicsState;
    return rep;
}

function run(argv) {
    var output = argv[0];
    if (!output) throw new Error('Укажи, куда сохранить фон');
    var image = $.NSImage.alloc.initWithSize($.NSMakeSize(WIDTH, HEIGHT));
    image.addRepresentation(renderInto(1));
    image.addRepresentation(renderInto(2));
    var data = image.TIFFRepresentation;
    if (data.isNil() || !data.writeToFileAtomically(output, true)) {
        throw new Error('Не удалось сохранить ' + output);
    }
    return 'готово: ' + output;
}
