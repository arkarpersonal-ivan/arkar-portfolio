// Quick contrast verification for the new palette
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function luminance(r, g, b) {
    const srgb = [r, g, b].map(v => v / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrast(hex1, hex2) {
    const a = hexToRgb(hex1);
    const b = hexToRgb(hex2);
    const l1 = luminance(a.r, a.g, a.b);
    const l2 = luminance(b.r, b.g, b.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// New warm ivory palette (style.css v4)
const pairs = [
    // Core text on warm ivory page background
    ['text-primary on page-bg',     '#1A232B', '#F7F5F0'],
    ['text-secondary on page-bg',   '#4E5A64', '#F7F5F0'],
    ['text-muted on page-bg',       '#67737C', '#F7F5F0'],

    // Core text on white card surfaces
    ['text-primary on surface',     '#1A232B', '#FDFCFA'],
    ['text-secondary on surface',   '#4E5A64', '#FDFCFA'],
    ['text-muted on surface',       '#67737C', '#FDFCFA'],

    // Structural accent
    ['accent on white',             '#5A6B7A', '#FDFCFA'],
    ['white on accent',             '#FFFFFF', '#5A6B7A'],
    ['accent-dark on white',        '#46535F', '#FDFCFA'],
    ['white on accent-dark',        '#FFFFFF', '#46535F'],

    // Surface-2 (soft warm gray)
    ['text-primary on surface-2',   '#1A232B', '#F1EFEA'],
    ['text-secondary on surface-2', '#4E5A64', '#F1EFEA'],

    // Ubuntu orange accent
    ['ubuntu-orange on surface',    '#E95420', '#FDFCFA'],
    ['ubuntu-orange on surface-2',  '#E95420', '#F1EFEA'],
    ['ubuntu-orange on page-bg',    '#E95420', '#F7F5F0'],
    ['white on ubuntu-orange',      '#FFFFFF', '#E95420'],

    // Primary button (dark navy base)
    ['white on btn-primary',        '#FFFFFF', '#1D2932'],
    ['btn-primary hover border',    '#E95420', '#141D24'],
];

console.log('=== CONTRAST VERIFICATION - V4 WARM IVORY PALETTE ===');
console.log('AA requires 4.5:1 for normal text, 3:1 for large text');
console.log('');
pairs.forEach(([name, fg, bg]) => {
    const ratio = contrast(fg, bg);
    const pass = ratio >= 4.5 ? 'PASS (AA)' : ratio >= 3 ? 'PASS (large)' : 'FAIL';
    console.log(name + ': ' + ratio.toFixed(2) + ':1 - ' + pass);
});