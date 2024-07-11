const esbuild = require('esbuild');
const { envInnerResources, envEnd } = require('./esbuild.plugins');

const env = process.env;
const isDev = env.APP_ENV === 'dev';
const info =
  `// ==UserScript==\n` +
  `// @name         ${env.npm_package_displayName}\n` +
  `// @namespace    http://tampermonkey.net/\n` +
  `// @version      ${env.npm_package_version}\n` +
  `// @description  ${env.npm_package_description}\n` +
  `// @compatible   edge Violentmonkey\n` +
  `// @compatible   edge Tampermonkey\n` +
  `// @compatible   chrome Violentmonkey\n` +
  `// @compatible   chrome Tampermonkey\n` +
  `// @compatible   firefox Violentmonkey\n` +
  `// @compatible   firefox Tampermonkey\n` +
  `// @compatible   safari Violentmonkey\n` +
  `// @compatible   safari Tampermonkey\n` +
  `// @author       ${env.npm_package_author_name}\n` +
  `// @license      ${env.npm_package_license}\n` +
  '// @match        *://*.zhihu.com/*\n' +
  // `// @grant        unsafeWindow\n` +
  `// @grant        GM_info\n` +
  `// @grant        GM_setValue\n` +
  `// @grant        GM_getValue\n` +
  `// @grant        GM.getValue\n` +
  `// @grant        GM.setValue\n` +
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
  plugins: [envInnerResources, envEnd],
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
