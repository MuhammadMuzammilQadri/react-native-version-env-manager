const updateVersion = require('./updateVersion');
const updateEnv = require('./updateEnv');
const helpers = require('./lib/helpers');
const argv = require('yargs').argv;

const pathToRoot = process.cwd();

const pathToEnv = argv.pathToEnv || `${pathToRoot}/src/envs`;
const envToSet = argv.env;
const envFileExt = argv.envFileExt;
const shouldAddEnvAsPostfix = argv.addEnvAsPostfix;

const pathToPackage = argv.pathToPackage || `${pathToRoot}/package.json`;
const info = helpers.getPackageInfo(pathToPackage);
const pathToPlist =
  argv.pathToPlist || `${pathToRoot}/ios/${info.name}/Info.plist`;
const pathToGradle =
  argv.pathToGradle || `${pathToRoot}/android/app/build.gradle`;
// handle case of several plist files
const pathsToPlists = Array.isArray(pathToPlist) ? pathToPlist : [pathToPlist];

const shouldWorkSilently = argv.silently;
const shouldUpdateVersion = argv.updateVersion;

if (shouldUpdateVersion) {
  updateVersion(
    shouldWorkSilently,
    pathToPackage,
    pathToGradle,
    pathToPlist,
    pathsToPlists
  );
}

if (envToSet) {
  updateEnv(
    pathToEnv,
    envToSet,
    pathToPackage,
    envFileExt,
    shouldAddEnvAsPostfix
  );
}
