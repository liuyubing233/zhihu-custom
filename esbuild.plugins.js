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
      return { contents: prevContent.replace(regexpHTML, `$1${innerHTML}$3`).replace(regexpCSS, `$1${innerCSS}$3`) };
    });
  },
};

/** 打包完成后添加油猴信息并生成 index.js */
const envEnd = {
  name: 'envEnd',
  setup(build) {
    build.onEnd(() => {
      const pathIndex = path.join(__dirname, '/dist/index.js');
      const pathPackage = path.join(__dirname, '/package.json');
      const strIndexDist = fs.readFileSync(pathIndex).toString();
      if (!strIndexDist) return;
      const packageConf = JSON.parse(fs.readFileSync(pathPackage).toString());
      const info =
        `// ==UserScript==\n` +
        `// @name         ${packageConf.displayName}\n` +
        `// @namespace    http://tampermonkey.net/\n` +
        `// @version      ${packageConf.version}\n` +
        `// @description  ${packageConf.description}\n` +
        `// @compatible   edge Violentmonkey\n` +
        `// @compatible   edge Tampermonkey\n` +
        `// @compatible   chrome Violentmonkey\n` +
        `// @compatible   chrome Tampermonkey\n` +
        `// @compatible   firefox Violentmonkey\n` +
        `// @compatible   firefox Tampermonkey\n` +
        `// @author       ${packageConf.author}\n` +
        '// @match        *://*.zhihu.com/*' +
        `\n// @grant        unsafeWindow\n` +
        `// @grant        GM_info\n` +
        `// @grant        GM_setValue\n` +
        `// @grant        GM_getValue\n` +
        `// @grant        GM.getValue\n` +
        `// @grant        GM.setValue\n` +
        `// @run-at       document-start\n` +
        `// ==/UserScript==`;
      const regexp = /"use\s{1}strict";\n\(\(\)\s{1}\=\>\s{1}\{([\W\w]*)\}\)\(\);\n?$/;
      const funContent = strIndexDist.match(regexp)?.[1];
      if (!funContent) {
        console.log('没匹配到内容');
        return;
      }
      const nIndex = `${info}\n\n(function(){\n  'use strict';\n${funContent}})()`;
      fs.writeFileSync(path.join(__dirname, 'index.js'), nIndex);
    });
  },
};

module.exports = { envInnerResources, envEnd };
