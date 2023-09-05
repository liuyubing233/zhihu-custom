const fs = require('fs');
const path = require('path');

/** 加载 HTML 和 CSS 资源 */
const envInnerResources = {
  name: 'envInnerResources',
  setup(build) {
    build.onLoad({ filter: /web-resources.ts/ }, (args) => {
      const NAME_HTML = 'INNER_HTML';
      const NAME_CSS = 'INNER_CSS';

      const pathHTML = path.join(__dirname, '/src/static/index.html');
      const pathCSS = path.join(__dirname, '/src/static/index.css');

      const REGEXP_REPLACE = /\s*\n\s*/g; // 删除回车及前后空格
      const REGEXP_REPLACE_COMMIT = /\<\!\-\-[^(\<\!)]*\-\-\>/g; // 删除HTML注释

      const strHTML = fs.readFileSync(pathHTML).toString();
      const strCSS = fs.readFileSync(pathCSS).toString();
      const prevContent = fs.readFileSync(args.path).toString();
      const nRegExp = (name) => new RegExp('(' + name + '\\s\\=\\s`)()(`)');

      const regexpHTML = nRegExp(NAME_HTML);
      const innerHTML = strHTML.replace(REGEXP_REPLACE, '').replace(REGEXP_REPLACE_COMMIT, '');
      const regexpCSS = nRegExp(NAME_CSS);
      const innerCSS = strCSS.replace(REGEXP_REPLACE, '');

      const contents = prevContent.replace(regexpHTML, `$1${innerHTML}$3`).replace(regexpCSS, `$1${innerCSS}$3`);

      return { contents };
    });
  },
};

module.exports = { envInnerResources };
