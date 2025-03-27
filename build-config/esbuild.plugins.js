const fs = require('fs');
const path = require('path');
const less = require('less');
const htmlMinify = require('html-minifier').minify;

const envLoad = {
  name: 'envLoad',
  setup(build) {
    build.onLoad({ filter: /.ts/ }, async (args) => {
      const prevContent = fs.readFileSync(args.path).toString();

      if (args.path.includes('web-resources.ts')) {
        // 加载 HTML 和 CSS 资源
        const filenameLess = path.join(__dirname, '../src/styles/index.less');
        const contentLess = fs.readFileSync(filenameLess, 'utf-8');
        const res = await less.render(contentLess, { compress: true, filename: filenameLess });
        if (!res.css) {
          throw Error('less转css失败');
        }
        const NAME_HTML = 'INNER_HTML';
        const NAME_CSS = 'INNER_CSS';
        const pathHTML = path.join(__dirname, '../src/index.html');
        const REGEXP_REPLACE = /\s*\n\s*/g; // 删除回车及前后空格
        const strHTML = fs.readFileSync(pathHTML).toString();
        const nRegExp = (name) => new RegExp('(' + name + '\\s\\=\\s`)()(`)');

        const regexpCSS = nRegExp(NAME_CSS);
        const innerCSS = res.css.replace(REGEXP_REPLACE, '');
        return {
          contents: prevContent
            .replace(
              nRegExp(NAME_HTML),
              `$1${htmlMinify(strHTML, {
                removeComments: true,
                collapseWhitespace: true,
              })}$3`
            )
            .replace(regexpCSS, `$1${innerCSS}$3`),
          loader: 'ts',
        };
      }

      const REGEXP_ANNOTATE_1 = /\/\*\*[\s\S]*?\*\//g; // 匹配 /** */ 格式注释
      const REGEXP_ANNOTATE_2 = /\s\/\/.*/g; // 匹配 // xxx 格式注释
      return { contents: prevContent.replace(REGEXP_ANNOTATE_1, '').replace(REGEXP_ANNOTATE_2, ''), loader: 'ts' };
    });
  },
};

/** 打包完成后删除路径注释并生成 index.js*/
const envEnd = {
  name: 'envEnd',
  setup(build) {
    build.onEnd(() => {
      const pathIndex = path.join(__dirname, '../dist/index.js');
      const strIndexDist = fs.readFileSync(pathIndex).toString();
      if (!strIndexDist) return;
      const REGEXP_ANNOTATE_PATH = /\s*\/\/\ssrc[^\n]*\n/g; // 匹配路径注释
      fs.writeFileSync(path.join(__dirname, '../index.js'), strIndexDist.replace(REGEXP_ANNOTATE_PATH, '\n'));
    });
  },
};

module.exports = { envEnd, envLoad };
