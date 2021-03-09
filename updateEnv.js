const updateVersion = require('./updateVersion');
const log = require('./lib/log');
const fs = require('fs');
const path = require('path');
const helpers = require('./lib/helpers');

// prettier-ignore
const envFileTemplate =
  'const Env = {\n' +
  '  ${template}' +
  '\n};\n' +
  '\n' +
  'export default Env;\n';

function createEnvFileContent(pathToEnv, envToSet) {
  // read the content of the specified env file
  let envFileContent = fs
    .readFileSync(`${pathToEnv}/${envToSet}.env`)
    .toString()
    .trim()
    .split('\n')
    .filter((value) => value.trim() !== '');

  // insert current env as a property
  envFileContent.unshift(`CURRENT: '${envToSet.toUpperCase()}'`);

  // create a js/ts file from template
  envFileContent = envFileTemplate.replace(
    '${template}',
    envFileContent.join(',\n  ')
  );
  return envFileContent;
}

function normalizePath(pathToEnv) {
  // remove `/` at the end of the path
  return pathToEnv.charAt(-1) === '/' ? pathToEnv.slice(0, -1) : pathToEnv;
}

function removeExistingEnvFiles(pathToEnv) {
  // remove any existing env.* files if exist
  const envFiles = fs.readdirSync(pathToEnv).filter((el) => {
    return path.basename(el).split('.')[0] === 'env';
  });

  envFiles.map((fileName) => {
    log.info(`Removing old ${fileName} file: `);
    try {
      fs.unlinkSync(`${pathToEnv}/${fileName}`);
    } catch (e) {
      log.error(e);
    }
  });
}

function copyContentToEnvFile(pathToEnv, envFileExt, envFileContent) {
  fs.writeFileSync(
    `${pathToEnv}/env.${envFileExt || 'js'}`,
    envFileContent,
    'utf8'
  );
}

function addEnvAsPostfixToVersionInPackageJsonFile(
  shouldAddEnvAsPostfix,
  pathToPackage,
  envToSet
) {
  let postFix;
  let notify;
  if (shouldAddEnvAsPostfix) {
    postFix = `-${envToSet.toUpperCase()}`;
    notify = () =>
      log.imp('', `Added ${postFix} as a postfix to version in package.json`);
  } else {
    postFix = '';
  }

  helpers.addPostfixToVersionInPackageInfo(pathToPackage, postFix);
  notify === null || notify === void 0 ? void 0 : notify();
}

module.exports = async function (
  pathToPackage,
  pathToGradle,
  pathToPlist,
  pathsToPlists,
  pathToEnv,
  envToSet,
  envFileExt,
  shouldAddEnvAsPostfix
) {
  pathToEnv = normalizePath(pathToEnv);
  let envFileContent = createEnvFileContent(pathToEnv, envToSet);
  removeExistingEnvFiles(pathToEnv);
  copyContentToEnvFile(pathToEnv, envFileExt, envFileContent);
  addEnvAsPostfixToVersionInPackageJsonFile(
    shouldAddEnvAsPostfix,
    pathToPackage,
    envToSet
  );
  // update version in android/iOS
  await updateVersion(
    true,
    pathToPackage,
    pathToGradle,
    pathToPlist,
    pathsToPlists
  );
  // notify
  log.success('Environment set: ' + envToSet.toUpperCase());
};
