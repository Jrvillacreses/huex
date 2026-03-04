/**
 * Shared color utility functions for HueX backend.
 * Provides color family classification from HEX values.
 */

/**
 * Converts a HEX color string to its HSL components.
 * @param hex - Color in #RRGGBB or #RGB format
 * @returns { h, s, l } in ranges [0-360], [0-100], [0-100]
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
    // Normalize hex
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
        clean = clean.split('').map(c => c + c).join('');
    }

    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }

        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }

    return {
        h,
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/**
 * Returns the human-readable Spanish color family name for a given HEX color.
 * @param hex - Color in #RRGGBB or #RGB format
 * @returns Spanish family name like "Azul", "Rojo", "Verde", etc.
 */
export function getColorFamily(hex: string): string {
    if (!hex || !hex.startsWith('#')) return 'Desconocido';

    const { h, s, l } = hexToHsl(hex);

    // Achromatic cases (very low saturation or extreme lightness)
    if (l <= 8) return 'Negro';
    if (l >= 92) return 'Blanco';
    if (s <= 10) return 'Gris';

    // Chromatic families by hue
    if (h >= 0 && h < 15) return 'Rojo';
    if (h >= 15 && h < 45) return 'Naranja';
    if (h >= 45 && h < 70) return 'Amarillo';
    if (h >= 70 && h < 155) return 'Verde';
    if (h >= 155 && h < 195) return 'Cian';
    if (h >= 195 && h < 265) return 'Azul';
    if (h >= 265 && h < 295) return 'Morado';
    if (h >= 295 && h < 345) return 'Rosa';
    return 'Rojo'; // 345-360 wraps back to red
}
