const esbuild = require('esbuild');
const { envEnd, envLoad } = require('./esbuild.plugins');
const pkg = require('../package.json');

const env = process.env;
const isDev = env.APP_ENV === 'dev';
const author = typeof pkg.author === 'string' ? pkg.author : pkg.author?.name || '';
const info =
  `// ==UserScript==\n` +
  `// @name         ${pkg.displayName || pkg.name}\n` +
  `// @namespace    http://tampermonkey.net/\n` +
  `// @version      ${pkg.version}\n` +
  `// @description  ${pkg.description}\n` +
  `// @compatible   edge Violentmonkey\n` +
  `// @compatible   edge Tampermonkey\n` +
  `// @compatible   chrome Violentmonkey\n` +
  `// @compatible   chrome Tampermonkey\n` +
  `// @compatible   firefox Violentmonkey\n` +
  `// @compatible   firefox Tampermonkey\n` +
  `// @compatible   safari Violentmonkey\n` +
  `// @compatible   safari Tampermonkey\n` +
  `// @author       ${author}\n` +
  `// @license      ${pkg.license}\n` +
  '// @match        *://*.zhihu.com/*\n' +
  `// @grant        unsafeWindow\n` +
  `// @grant        GM_info\n` +
  `// @grant        GM_setValue\n` +
  `// @grant        GM_getValue\n` +
  `// @grant        GM.getValue\n` +
  `// @grant        GM.setValue\n` +
  `// @grant        GM.deleteValue\n` +
  `// @grant        GM_registerMenuCommand\n` +
  `// @run-at       document-start\n` +
  `// ==/UserScript==\n`;

const options = {
  entryPoints: ['./src/index.ts'],
  outdir: 'dist',
  // outfile: 'index.js',
  bundle: true, // 是否打包
  format: 'iife', // 打包输出格式设置为 iife，用立即执行函数包裹
  minify: false,
  charset: 'utf8',
  plugins: [envLoad, envEnd],
  banner: {
    js: info,
  },
};

const onWatch = async () => {
  const context = await esbuild.context(options);
  await context.watch();
  const res = await context.serve({
    port: 5555,
    servedir: '.',
  });
  console.log('成功启动，端口号: ', res.port);
};

const onBuild = () => {
  esbuild.build(options);
};

isDev ? onWatch() : onBuild();
