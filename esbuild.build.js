const esbuild = require('esbuild');
const { envInnerResources } = require('./esbuild.plugins');

const isDev = process.env.APP_ENV === 'dev';

const options = {
  entryPoints: ['./src/index.ts'],
  outfile: 'tampermonkeyIndex.js',
  bundle: true, // 是否打包
  format: 'iife', // 打包输出格式设置为 iife，用立即执行函数包裹
  minify: false,
  charset: 'utf8',
  plugins: [envInnerResources],
};

const onServe = async () => {
  const context = await esbuild.context(options);
  const res = await context.rebuild();
  context.serve({
    port: 5555,
  });
  // await context.dispose();
};

const onBuild = () => {
  esbuild.build(options);
};

isDev ? onServe() : onBuild();
