const fs = require('fs');
const path = require('path');
const less = require('less');

/** 加载 HTML 和 CSS 资源 */
const envInnerResources = {
  name: 'envInnerResources',
  setup(build) {
    build.onLoad({ filter: /web-resources.ts/ }, async (args) => {
      const filenameLess = path.join(__dirname, '../src/styles/index.less');
      const contentLess = fs.readFileSync(filenameLess, 'utf-8');
      const res = await less.render(contentLess, { compress: true, filename: filenameLess });
      if (!res.css) {
        throw Error('less转css失败');
      }
      const NAME_HTML = 'INNER_HTML';
      const NAME_CSS = 'INNER_CSS';
      const pathHTML = path.join(__dirname, '../src/static/index.html');
      const REGEXP_REPLACE = /\s*\n\s*/g; // 删除回车及前后空格
      const REGEXP_REPLACE_COMMIT = /\<\!\-\-[^(\<\!)]*\-\-\>/g; // 删除HTML注释
      const strHTML = fs.readFileSync(pathHTML).toString();
      const prevContent = fs.readFileSync(args.path).toString();
      const nRegExp = (name) => new RegExp('(' + name + '\\s\\=\\s`)()(`)');
      const regexpHTML = nRegExp(NAME_HTML);
      const innerHTML = strHTML.replace(REGEXP_REPLACE, '').replace(REGEXP_REPLACE_COMMIT, '');
      const regexpCSS = nRegExp(NAME_CSS);
      const innerCSS = res.css.replace(REGEXP_REPLACE, '');
      return { contents: prevContent.replace(regexpHTML, `$1${innerHTML}$3`).replace(regexpCSS, `$1${innerCSS}$3`) };
    });
  },
};

/** 打包完成后删除路径注释并生成 index.js */
const envEnd = {
  name: 'envEnd',
  setup(build) {
    build.onEnd(() => {
      const pathIndex = path.join(__dirname, '../dist/index.js');
      const strIndexDist = fs.readFileSync(pathIndex).toString();
      if (!strIndexDist) return;
      const regCommit = /\s*\/\/\ssrc[^\n]*\n/g; // 匹配路径注释
      fs.writeFileSync(path.join(__dirname, '../index.js'), strIndexDist.replace(regCommit, '\n'));
    });
  },
};

module.exports = { envInnerResources, envEnd };
