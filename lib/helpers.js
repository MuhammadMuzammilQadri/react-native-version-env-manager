'use strict';

const fs = require('fs');

module.exports = {
  versions(raw) {
    return typeof raw === 'string' ? raw.split('.') : [];
  },

  version(raw, flag, reset = false) {
    if (reset) {
      return 0;
    }

    const parsed = parseInt(raw);
    const value = parsed >= 0 ? parsed : 0;
    return flag ? value + 1 : value;
  },

  getPackageInfo(pathToFile) {
    return JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
  },

  getBuildNumberFromPlist(pathToPlist) {
    const content = fs.readFileSync(pathToPlist, 'utf8');
    const match = content.match(
      /(<key>CFBundleVersion<\/key>\s+<string>)([\w.-]+)(<\/string>)/
    );
    if (match && match[2]) {
      return parseInt(match[2]);
    }

    return 1;
  },

  getVersionAndBuildFromGradle(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, 'utf8');

    let versionName = content.match(
      /(\s*versionName\s+["']?)([\w.-]+)(["']?\s*)/
    )[2];
    let versionCode = parseInt(
      content.match(/(\s*versionCode\s+["']?)(\d+)(["']?\s*)/)[2]
    );

    return { versionName, versionCode };
  },

  getVersionAndBuildFromPlist(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, 'utf8');

    let CFBundleShortVersionString = content.match(
      /(<key>CFBundleShortVersionString<\/key>\s*<string>)([\w.-]+)(<\/string>)/
    )[2];
    let CFBundleVersion = parseInt(
      content.match(
        /(<key>CFBundleVersion<\/key>\s+<string>)([\d.]+)(<\/string>)/
      )[2]
    );

    return { CFBundleShortVersionString, CFBundleVersion };
  },

  changeVersionAndBuildInPlist(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, 'utf8');
    content = content.replace(
      /(<key>CFBundleShortVersionString<\/key>\s*<string>)([\w.-]+)(<\/string>)/g,
      `$1${version}$3`
    );
    content = content.replace(
      /(<key>CFBundleVersion<\/key>\s+<string>)([\d.]+)(<\/string>)/g,
      `$1${build}$3`
    );
    fs.writeFileSync(pathToFile, content, 'utf8');
  },

  changeVersionAndBuildInGradle(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, 'utf8');
    content = content.replace(
      /(\s*versionName\s+["']?)([\w.-]+)(["']?\s*)/g,
      `$1${version}$3`
    );
    content = content.replace(
      /(\s*versionCode\s+["']?)(\d+)(["']?\s*)/g,
      `$1${build}$3`
    );
    fs.writeFileSync(pathToFile, content, 'utf8');
  }
};
