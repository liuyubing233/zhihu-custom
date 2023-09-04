/** 加载页面资源 */
const fs = require('fs');
const path = require('path');

module.exports = function (source) {
  const NAME_HTML = 'INNER_HTML';
  const NAME_CSS = 'INNER_CSS';
  const pathHTML = path.join(__dirname, '../src/static/index.html');
  const pathCSS = path.join(__dirname, '../src/static/index.css');

  const REGEXP_REPLACE = /\s*\n\s*/g; // 删除回车及前后空格
  const REGEXP_REPLACE_COMMIT = /\<\!\-\-[^(\<\!)]*\-\-\>/g; // 删除HTML注释

  const strHTML = fs.readFileSync(pathHTML).toString();
  const strCSS = fs.readFileSync(pathCSS).toString();

  const nRegExp = (name) => new RegExp('(' + name + '\\s\\=\\s`)()(`)');

  const regexpHTML = nRegExp(NAME_HTML);
  const innerHTML = strHTML.replace(REGEXP_REPLACE, '').replace(REGEXP_REPLACE_COMMIT, '');
  const regexpCSS = nRegExp(NAME_CSS);
  const innerCSS = strCSS.replace(REGEXP_REPLACE, '');

  return source.replace(regexpHTML, `$1${innerHTML}$3`).replace(regexpCSS, `$1${innerCSS}$3`);
};
