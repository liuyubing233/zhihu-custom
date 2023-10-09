const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const { exec } = shell;

const status = process.argv[process.argv.length - 1]
const prevVersion = process.env.npm_package_version;
const [vMajor, vMinor, vRevision] = prevVersion.split('.');
const changeVersion = {
  'fix': `${vMajor}.${vMinor}.${+vRevision + 1}`,
  'feature': `${vMajor}.${+vMinor + 1}.0`,
  'release': `${+vMajor + 1}.0.0`,
}

if (!changeVersion[status]) {
  console.log(`自动打标参数必须为以下其中一种:
  fix      问题修改&功能优化(0.0.0 ---> 0.0.1),
  feature  功能添加(0.0.0 ---> 0.1.0),
  release  大版本更新(0.0.0 ---> 1.0.0)`);
  return;
}

const nVersion = changeVersion[status];
// console.log(prevVersion, nVersion);
// console.log(status, process.env.npm_package_version);

const regExpVersion = new RegExp(`("version":\\s*")([\\d\\.]+)(")`)
const pathPackageJson = path.join(__dirname, '/package.json');
const packageJson = fs.readFileSync(pathPackageJson).toString()
fs.writeFileSync(pathPackageJson, packageJson.replace(regExpVersion, `$1${nVersion}$3`))

// console.log(packageJson.replace(regExpVersion, `$1${nVersion}$3`));

