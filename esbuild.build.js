const esbuild = require('esbuild');
const { envInnerResources, envEnd } = require('./esbuild.plugins');

const isDev = process.env.APP_ENV === 'dev';

const options = {
  entryPoints: ['./src/index.ts'],
  // outfile: 'tampermonkeyIndex.js',
  outdir: 'dist',
  bundle: true, // 是否打包
  format: 'iife', // 打包输出格式设置为 iife，用立即执行函数包裹
  minify: false,
  charset: 'utf8',
  plugins: [envInnerResources, envEnd],
};

const onWatch = async () => {
  const context = await esbuild.context(options);
  await context.watch();
  const res = await context.serve({
    port: 5555,
    servedir: '.',
  });
  console.log('服务已启动...端口号:', res.port);
};

const onBuild = () => {
  esbuild.build(options);
};

isDev ? onWatch() : onBuild();
