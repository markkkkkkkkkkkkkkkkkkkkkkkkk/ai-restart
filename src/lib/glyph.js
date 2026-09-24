// glyph.js — значок для строки меню. Рисуется вектором и помечается как template:
// тогда macOS сама красит его в цвет строки меню, включая подсветку и выбранный
// пользователем оттенок в macOS 26+. Цветную иконку туда ставить нельзя — она
// выбивается из ряда системных значков.

// Берём чистый системный символ и ничего к нему не дорисовываем: на 18 точках любая
// добавка (искра внутри кольца и т.п.) превращается в кашу и выбивается из ряда.
// Поменять значок = поменять одно имя ниже, список есть в приложении SF Symbols.
var GLYPH_SYMBOL = 'arrow.trianglehead.clockwise';
// Кегль символа внутри поля 18 точек. Системные значки рисуются примерно так же:
// крупнее — и значок начинает выпирать из ряда.
var GLYPH_POINTS = 14;

function drawGlyph(size) {
    var symbol = $.NSImage.imageWithSystemSymbolNameAccessibilityDescription(GLYPH_SYMBOL, $());
    if (symbol.isNil()) return;
    var config = $.NSImageSymbolConfiguration.configurationWithPointSizeWeight(
        GLYPH_POINTS * size / 18, $.NSFontWeightRegular);
    symbol = symbol.imageWithSymbolConfiguration(config);
    var box = symbol.size;
    symbol.drawInRectFromRectOperationFraction(
        $.NSMakeRect((size - box.width) / 2, (size - box.height) / 2, box.width, box.height),
        $.NSZeroRect, $.NSCompositingOperationSourceOver, 1);
}

// Один и тот же вектор в двух масштабах: обычном и Retina.
function glyphRepresentation(size, scale) {
    var rep = $.NSBitmapImageRep.alloc.initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
        $(), size * scale, size * scale, 8, 4, true, false, $.NSCalibratedRGBColorSpace, 0, 0);
    rep.size = $.NSMakeSize(size, size);
    $.NSGraphicsContext.saveGraphicsState;
    $.NSGraphicsContext.setCurrentContext($.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep));
    $.NSColor.blackColor.set;   // у template-изображения важна только прозрачность
    drawGlyph(size);
    $.NSGraphicsContext.restoreGraphicsState;
    return rep;
}

function menuBarIcon(size) {
    var image = $.NSImage.alloc.initWithSize($.NSMakeSize(size, size));
    image.addRepresentation(glyphRepresentation(size, 1));
    image.addRepresentation(glyphRepresentation(size, 2));
    image.template = true;
    return image;
}
