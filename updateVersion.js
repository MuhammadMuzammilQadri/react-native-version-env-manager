const helpers = require('./lib/helpers');
const log = require('./lib/log');
const readlineSync = require('readline-sync');

module.exports = async function (
  shouldWorkSilently,
  pathToPackage,
  pathToGradle,
  pathToPlist,
  pathsToPlists
) {
  const info = helpers.getPackageInfo(pathToPackage);

  const toBeVersionName = info.version;
  const toBeBuildNumber = info.buildNumber;

  const {
    CFBundleShortVersionString,
    CFBundleVersion
  } = helpers.getVersionAndBuildFromPlist(pathsToPlists[0]);

  const { versionCode, versionName } = helpers.getVersionAndBuildFromGradle(
    pathToGradle
  );

  helpers.getBuildNumberFromPlist(pathsToPlists[0]);

  if (shouldWorkSilently) {
    log.notice('\nSetting the version in Android & iOS...');
    log.notice(
      `From: ${versionName}(${versionCode}), To: ${toBeVersionName}(${toBeBuildNumber}) `
    );
  } else {
    log.info('\nSetting the version in:');

    log.imp('- ios project ', `(${pathsToPlists.join(', ')})`, 1);
    log.info('- current:', 2);
    log.notice(
      `- CFBundleShortVersionString: ${CFBundleShortVersionString}, CFBundleVersion: ${CFBundleVersion}`,
      3
    );
    log.info('- to:', 2);
    log.notice(
      `- CFBundleShortVersionString: ${toBeVersionName}, CFBundleVersion: ${toBeBuildNumber}`,
      3
    );

    log.imp('- android project ', `(${pathToGradle})`, 1);
    log.info('- current:', 2);
    log.notice(`- versionName: ${versionName}, versionCode: ${versionCode}`, 3);
    log.info('- to:', 2);
    log.notice(
      `- versionName: ${toBeVersionName}, versionCode: ${toBeBuildNumber}`,
      3
    );
  }

  function updateVersionInIos() {
    return () => {
      if (!shouldWorkSilently)
        log.info('Updating version in ios project...', 1);

      pathsToPlists.forEach((pathToPlist) => {
        helpers.changeVersionAndBuildInPlist(
          pathToPlist,
          toBeVersionName,
          toBeBuildNumber
        );
      });
      if (!shouldWorkSilently)
        log.success(
          'Version and build number in ios project (plist file) changed.',
          2
        );
    };
  }

  function updateVersionInAndroid() {
    return () => {
      if (!shouldWorkSilently)
        log.info('Updating version in android project...', 1);

      helpers.changeVersionAndBuildInGradle(
        pathToGradle,
        toBeVersionName,
        toBeBuildNumber
      );
      if (!shouldWorkSilently)
        log.success(
          'Version and build number in android project (gradle file) changed.',
          2
        );
    };
  }

  const askForConfirmation = new Promise((resolve, reject) => {
    log.line();

    if (shouldWorkSilently) {
      resolve();
      return;
    }

    const question = log.info('Are you sure? [y/n] ', 0, true);
    const answer = readlineSync.question(question).toLowerCase();
    answer === 'y' ? resolve() : reject('Process canceled.');
  });

  await askForConfirmation
    .then(() => {
      if (!shouldWorkSilently) log.notice('\nUpdating versions');
    })
    .then(updateVersionInIos())
    .then(updateVersionInAndroid())
    .catch((e) => {
      log.error(e);
    });
};
