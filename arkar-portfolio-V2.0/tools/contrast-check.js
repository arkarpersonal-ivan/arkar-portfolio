const fs = require('fs');
const css = fs.readFileSync('style.css','utf8');

// Very small parser to extract color tokens and compute contrast for text on backgrounds
// We'll look for --variables and direct hex colors used in color/background declarations

function extractVars(cssText){
  const vars = {};
  const varBlock = cssText.match(/:root\s*{([\s\S]*?)}/);
  if(varBlock){
    const lines = varBlock[1].split(/;\s*/);
    lines.forEach(l=>{
      const m = l.match(/--([\w-]+):\s*([^;]+)/);
      if(m) vars[m[1].trim()] = m[2].trim();
    });
  }
  return vars;
}

function hexToRgb(hex){
  if(!hex) return null;
  hex = hex.replace('#','').trim();
  if(hex.length===3) hex = hex.split('').map(c=>c+c).join('');
  const num = parseInt(hex,16);
  return {r:(num>>16)&255,g:(num>>8)&255,b:num&255};
}

function luminance(r,g,b){
  const srgb = [r,g,b].map(v=>v/255).map(c=> c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4));
  return 0.2126*srgb[0]+0.7152*srgb[1]+0.0722*srgb[2];
}

function contrast(rgb1,rgb2){
  const L1 = luminance(rgb1.r,rgb1.g,rgb1.b);
  const L2 = luminance(rgb2.r,rgb2.g,rgb2.b);
  const lighter = Math.max(L1,L2);
  const darker = Math.min(L1,L2);
  return (lighter+0.05)/(darker+0.05);
}

const vars = extractVars(css);
const report = [];

// find uses like color: #fff or background: #fff
const colorUses = css.match(/(color|background|background-color):\s*([^;\n]+)/g)||[];

colorUses.forEach(decl=>{
  const parts = decl.split(':');
  const prop = parts[0].trim();
  const val = parts.slice(1).join(':').trim().replace(';','');
  const hex = val.match(/#([0-9a-fA-F]{3,6})/);
  if(hex){
    report.push({prop,val,hex:hex[0]});
  }
});

// Compare navbar text color vs navbar background
const bgMatch = css.match(/header\.navbar[^{]*{([\s\S]*?)}/);
let navbarBg = '#252522';
let navbarText = '#ffffff';
if(bgMatch){
  const block = bgMatch[1];
  const m1 = block.match(/background:\s*([^;\n]+)/);
  const m2 = block.match(/color:\s*([^;\n]+)/);
  if(m1 && m1[1].includes('#')) navbarBg = m1[1].trim();
  if(m2 && m2[1].includes('#')) navbarText = m2[1].trim();
}

const rgbBg = hexToRgb(navbarBg);
const rgbText = hexToRgb(navbarText);
const navContrast = contrast(rgbBg,rgbText);

console.log('Navbar contrast', navbarBg, navbarText, navContrast.toFixed(2));

// Quick variable contrast checks for common pairs
if(vars['page-bg'] && vars['text']){
  const a = hexToRgb(vars['page-bg']);
  const b = hexToRgb(vars['text']);
  if(a && b) console.log('Page background vs text contrast', contrast(a,b).toFixed(2));
}

console.log('\nFound color uses (sample):');
report.slice(0,30).forEach(r=>console.log(r.prop, r.hex, r.val));

// Save report
fs.writeFileSync('tools/contrast-report.txt', 'Navbar contrast: '+navContrast.toFixed(2)+'\n');
console.log('\nSaved report to tools/contrast-report.txt');
