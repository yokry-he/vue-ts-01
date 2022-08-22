import convert from 'color-convert';
const rgbRegex = /(?:.*?)rgb(?:a)?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([01]|1.0*|0?\.[0-9]{0,}))?\s*\)/;
export function rgbToHsl(rgbStr: string) {
    if (!rgbStr) return null;
    const rslt = rgbRegex.exec(rgbStr);
    if (!!rslt) {
        const [, r, g, b, a] = rslt;
        const hsl = convert.rgb.hsl(toInt(r), toInt(g), toInt(b));
        return new Hsl(hsl, round(a, 4));
    } else {
        return null;
    }
}

class Hsl {
    hsl: [number, number, number];
    alpha: number;
    constructor(hsl: [number, number, number], alpha = 1) {
        this.hsl = hsl;
        this.alpha = alpha;
    }
    toArray() {
        return this.hsl;
    }
    toHslString() {
        return `hsl(${this.hsl[0]}, ${this.hsl[1]}, ${this.hsl[2]})`;
    }
    toHslaString() {
        return `hsla(${this.hsl[0]}, ${this.hsl[1]}, ${this.hsl[2]}, ${this.alpha})`;
    }
    toRgbString() {
        const rgb = convert.hsl.rgb(this.hsl);
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
    toRgbaString() {
        const rgb = convert.hsl.rgb(this.hsl);
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${this.alpha})`;
    }
}

function round(num: number | string, decimal = 0) {
    let n = parseFloat(num as string);
    if (isNaN(n)) return 0;
    return Math.round(n * Math.pow(10, decimal)) / Math.pow(10, decimal);
}
function toInt(num: number | string, defaultValue = 0) {
    let n = parseInt(num as string);
    if (isNaN(n)) return defaultValue;
    return n;
}
