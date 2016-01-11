/**
* A class to parse color values in different formats and convert to others. 
* @author Stoyan Stefanov <sstoo@gmail.com>, modified by Piyush Soni <piyush_soni@yahoo.com>
* @OriginalScriptLink   http://www.phpied.com/rgb-color-parser-in-javascript/
* @ModifiedScriptLink   http://www.piyushsoni.com/scripts/RGBColor.js
* @license Use it if you like it
*/

// HSL conversion: MJI Jackson, mjijackson.com, adapted from http://en.wikipedia.org/wiki/HSL_color_space.
var rgbR = 0, rgbG = 0, rgbB = 0, rgbH = 0, rgbS = 0, rgbL = 0;

var simple_colors = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '00ffff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000000',
    blanchedalmond: 'ffebcd',
    blue: '0000ff',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '00ffff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkgrey: 'a9a9a9',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkslategrey: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dimgrey: '696969',
    dodgerblue: '1e90ff',
    feldspar: 'd19275',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'ff00ff',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    grey: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgray: 'd3d3d3',
    lightgreen: '90ee90',
    lightgrey: 'd3d3d3',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '778899',
    lightslategrey: '778899',
    lightslateblue: '8470ff',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '00ff00',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'ff00ff',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370d8',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'd87093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    red: 'ff0000',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    slategrey: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    violetred: 'd02090',
    wheat: 'f5deb3',
    white: 'ffffff',
    whitesmoke: 'f5f5f5',
    yellow: 'ffff00',
    yellowgreen: '9acd32'
};

function ColorRGBFunc(bits) {
    rgbR = parseInt(bits[1]);
    rgbG = parseInt(bits[2]);
    rgbB = parseInt(bits[3]);
}
function ColorHashFunc(bits) {
    rgbR = parseInt(bits[1], 16);
    rgbG = parseInt(bits[2], 16);
    rgbB = parseInt(bits[3], 16);
}
function ColorShortHashFunc(bits) {
    rgbR = parseInt(bits[1] + bits[1], 16);
    rgbG = parseInt(bits[2] + bits[2], 16);
    rgbB = parseInt(bits[3] + bits[3], 16);
}

// array of color definition objects
var color_defs = [
    { re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        process: ColorRGBFunc
    },
    { re: /^(\w{2})(\w{2})(\w{2})$/,
        process: ColorHashFunc
    },
    { re: /^(\w{1})(\w{1})(\w{1})$/,
        process: ColorShortHashFunc
    }
];

function ConvertColorToRGB(s) {
    var ok = false;
    s = s.replace(/ /g, '');
    // strip any leading #
    if (s.charAt(0) == '#') {
        // remove # if any
        s = s.substr(1, 6);
    }
    s = s.toLowerCase();

    if (simple_colors[s]) {
        s = simple_colors[s];
    }
    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var bits = color_defs[i].re.exec(s);
        if (bits) {
            color_defs[i].process(bits);
            ok = true;
            break;
        }
    }
    // validate/cleanup values
    rgbR = (rgbR < 0 || isNaN(rgbR)) ? 0 : ((rgbR > 255) ? 255 : rgbR);
    rgbG = (rgbG < 0 || isNaN(rgbG)) ? 0 : ((rgbG > 255) ? 255 : rgbG);
    rgbB = (rgbB < 0 || isNaN(rgbB)) ? 0 : ((rgbB > 255) ? 255 : rgbB);
    return ok;
}

function rgbToHex() {
    var r = rgbR.toString(16);
    var g = rgbG.toString(16);
    var b = rgbB.toString(16);
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    return '#' + r + g + b;
}

function rgbToHsl() {
    var r = rgbR / 255, g = rgbG / 255, b = rgbB / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    rgbL = (max + min) / 2;
    if (max == min) {
        rgbH = rgbS = 0; // achromatic
    } else {
        var d = max - min;
        rgbS = rgbL > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: rgbH = (g - b) / d + (g < b ? 6 : 0); break;
            case g: rgbH = (b - r) / d + 2; break;
            case b: rgbH = (r - g) / d + 4; break;
        }
        rgbH /= 6;
    }
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function hslToRgb() {
    if (rgbS == 0) {
        rgbR = rgbG = rgbB = rgbL; // achromatic
    } else {
        var q = rgbL < 0.5 ? rgbL * (1 + rgbS) : rgbL + rgbS - rgbL * rgbS;
        var p = 2 * rgbL - q;
        rgbR = hue2rgb(p, q, rgbH + 1 / 3);
        rgbG = hue2rgb(p, q, rgbH);
        rgbB = hue2rgb(p, q, rgbH - 1 / 3);
    }
    rgbR = (rgbR * 255) | 0;
    rgbG = (rgbG* 255) | 0;
    rgbB = (rgbB * 255) | 0;
}
