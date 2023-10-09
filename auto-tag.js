const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { exec, echo } = shell;

const status = process.argv[process.argv.length - 1];
const prevVersion = process.env.npm_package_version;
const [vMajor, vMinor, vRevision] = prevVersion.split('.');
const changeVersion = {
  fix: `${vMajor}.${vMinor}.${+vRevision + 1}`,
  feature: `${vMajor}.${+vMinor + 1}.0`,
  release: `${+vMajor + 1}.0.0`,
};

if (!changeVersion[status]) {
  echo(`自动打标参数必须为以下其中一种:
  fix      问题修改&功能优化(0.0.0 ---> 0.0.1),
  feature  功能添加(0.0.0 ---> 0.1.0),
  release  大版本更新(0.0.0 ---> 1.0.0)`);
  return;
}

const nVersion = changeVersion[status];
const regExpVersion = new RegExp(`("version":\\s*")([\\d\\.]+)(")`);
const pathPackageJson = path.join(__dirname, '/package.json');
const packageJson = fs.readFileSync(pathPackageJson).toString();
fs.writeFileSync(pathPackageJson, packageJson.replace(regExpVersion, `$1${nVersion}$3`));
echo(`package.json 文件版本号修改完成。\r\n原版本号: ${prevVersion}，新版本号: ${nVersion}`);

const doExec = async (commit) => {
  const res = exec(commit);
  if (res.code !== 0) {
    echo(`ERROR: ${commit}: ${code.stderr}`);
    return Promise.reject();
  }
  return Promise.resolve();
};

(async function () {
  await doExec('yarn build');
  await doExec('git add .');
  await doExec(`git commit -m "docs: v${nVersion}"`);
  await doExec(`git push`);
  await doExec(`git tag v${nVersion}--text`)
  await doExec(`git push --tag`)
})();
