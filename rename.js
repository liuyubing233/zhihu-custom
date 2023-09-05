const fs = require('fs');

const usePath = '/src/variable';
const nPath = __dirname + usePath;
const files = fs.readdirSync(nPath);
files.forEach((item) => {
  const [name, ext] = item.split('.');
  let nName = name;
  if (ext === 'js') {
    nName = nName + '.ts';
  }

  fs.renameSync(nPath + `/${item}`, nPath + `/${nName}`);
});
