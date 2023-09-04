/** 格式化HTML和CSS文件 */
const fs = require('fs');
const path = require('path');

const pathHTML = path.join(__dirname, '/src/index.html');
const pathCSS = path.join(__dirname, '/src/index.css');
const pathWriter = path.join(__dirname, '/src/format-html-css.js');
const strHTML = fs.readFileSync(pathHTML).toString();
const strCSS = fs.readFileSync(pathCSS).toString();
const REGEXP_REPLACE = /\s*\n\s*/g; // 删除回车及前后空格
const REGEXP_REPLACE_COMMIT = /\<\!\-\-[^(\<\!)]*\-\-\>/g; // 删除HTML注释
const contentHTML = 'export const INNER_HTML = `' + strHTML.replace(REGEXP_REPLACE, '').replace(REGEXP_REPLACE_COMMIT, '') + '`\n';
const contentCSS = 'export const INNER_CSS = `' + strCSS.replace(REGEXP_REPLACE, '') + '`\n';
const content = contentHTML + contentCSS;
fs.writeFileSync(pathWriter, content);
