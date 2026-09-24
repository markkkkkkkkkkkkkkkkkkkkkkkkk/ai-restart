// Рисует иконку AI Restart: стрелка перезагрузки с градиентом в стиле Apple Intelligence
// на тёмной плашке по сетке иконок macOS.
// Запуск: osascript -l JavaScript make-icon.js <out.png>
ObjC.import('AppKit');

function run(argv) {
    const out = argv[0] || 'icon.png';
    const S = 1024;
    const rep = $.NSBitmapImageRep.alloc.initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
        null, S, S, 8, 4, true, false, $.NSDeviceRGBColorSpace, 0, 0);
    $.NSGraphicsContext.saveGraphicsState;
    $.NSGraphicsContext.setCurrentContext($.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep));

    const hex = (h, a) => $.NSColor.colorWithSRGBRedGreenBlueAlpha(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255, a === undefined ? 1 : a);
    const shadow = (blur, color, dy) => {
        const s = $.NSShadow.alloc.init;
        s.shadowBlurRadius = blur; s.shadowColor = color; s.shadowOffset = $.NSMakeSize(0, dy || 0);
        s.set;
    };

    // Плашка macOS: 824×824 с отступом 100, скругление ~185.
    const tile = $.NSBezierPath.bezierPathWithRoundedRectXRadiusYRadius($.NSMakeRect(100, 100, 824, 824), 185, 185);
    $.NSGraphicsContext.saveGraphicsState;
    shadow(28, hex(0x000000, 0.45), -12);
    hex(0x000000).setFill; tile.fill;
    $.NSGraphicsContext.restoreGraphicsState;
    $.NSGradient.alloc.initWithStartingColorEndingColor(hex(0x2c2c30), hex(0x0b0b0e)).drawInBezierPathAngle(tile, -90);

    // Цвета по дуге — как свечение Apple Intelligence.
    const stops = [0x5AC8FA, 0x0A84FF, 0xBF5AF2, 0xFF375F, 0xFF9F0A, 0xFFD60A];
    const colorAt = (t, a) => {
        const x = Math.max(0, Math.min(0.9999, t)) * (stops.length - 1);
        const i = Math.floor(x), f = x - i, A = stops[i], B = stops[i + 1];
        const ch = (v, s) => ((v >> s) & 255) / 255;
        const mix = s => ch(A, s) + (ch(B, s) - ch(A, s)) * f;
        return $.NSColor.colorWithSRGBRedGreenBlueAlpha(mix(16), mix(8), mix(0), a);
    };

    const cx = 512, cy = 512, R = 245, W = 74;
    const start = 54, sweep = 292;   // градусы; дуга по часовой стрелке, разрыв под наконечник
    const steps = 360;

    function ring(alpha) {
        for (let s = 0; s < steps; s++) {
            const t0 = s / steps, t1 = (s + 1) / steps;
            const p = $.NSBezierPath.bezierPath;
            p.appendBezierPathWithArcWithCenterRadiusStartAngleEndAngleClockwise(
                $.NSMakePoint(cx, cy), R, start - sweep * t0, start - sweep * t1 - 0.3, true);
            p.lineWidth = W;
            p.lineCapStyle = s === 0 ? $.NSLineCapStyleRound : $.NSLineCapStyleButt;
            colorAt(t0, alpha).setStroke; p.stroke;
        }
        // Наконечник по касательной в конце дуги.
        const e = (start - sweep) * Math.PI / 180;
        const tip = [cx + R * Math.cos(e), cy + R * Math.sin(e)];
        const tan = [Math.sin(e), -Math.cos(e)], nor = [Math.cos(e), Math.sin(e)];
        const L = 150, H = 100;
        const head = $.NSBezierPath.bezierPath;
        head.moveToPoint($.NSMakePoint(tip[0] + tan[0] * L * 0.62, tip[1] + tan[1] * L * 0.62));
        head.lineToPoint($.NSMakePoint(tip[0] - tan[0] * L * 0.38 + nor[0] * H, tip[1] - tan[1] * L * 0.38 + nor[1] * H));
        head.lineToPoint($.NSMakePoint(tip[0] - tan[0] * L * 0.38 - nor[0] * H, tip[1] - tan[1] * L * 0.38 - nor[1] * H));
        head.closePath;
        head.lineWidth = 14; head.lineJoinStyle = $.NSLineJoinStyleRound;
        colorAt(1, alpha).setFill; colorAt(1, alpha).setStroke;
        head.fill; head.stroke;
    }

    // Мягкое свечение внутри плашки, потом сама стрелка.
    $.NSGraphicsContext.saveGraphicsState;
    tile.addClip;
    shadow(60, hex(0xBF5AF2, 0.9));
    ring(0.55);
    $.NSGraphicsContext.restoreGraphicsState;
    ring(1);

    // Искорки в центре — знак «интеллекта».
    function sparkle(x, y, r) {
        const k = 0.18, p = $.NSBezierPath.bezierPath;
        const q = (px, py, cx1, cy1) => p.curveToPointControlPoint1ControlPoint2(
            $.NSMakePoint(px, py), $.NSMakePoint(cx1, cy1), $.NSMakePoint(cx1, cy1));
        p.moveToPoint($.NSMakePoint(x, y + r));
        q(x + r, y, x + r * k, y + r * k);
        q(x, y - r, x + r * k, y - r * k);
        q(x - r, y, x - r * k, y - r * k);
        q(x, y + r, x - r * k, y + r * k);
        p.closePath;
        return p;
    }
    $.NSGraphicsContext.saveGraphicsState;
    shadow(30, hex(0xFFFFFF, 0.55));
    hex(0xFFFFFF).setFill; sparkle(512, 512, 118).fill;
    hex(0xFFFFFF, 0.85).setFill; sparkle(612, 606, 40).fill;
    $.NSGraphicsContext.restoreGraphicsState;

    $.NSGraphicsContext.restoreGraphicsState;
    rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $()).writeToFileAtomically(out, true);
    return 'saved ' + out;
}
