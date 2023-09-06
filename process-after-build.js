const fs = require('fs');
const path = require('path');

const appEnv = process.env.APP_ENV;

// 添加 tampermonkey 信息
function processAddInfo() {
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
}

if (appEnv === 'prod') {
  processAddInfo();
} else {
  // TODO
}
