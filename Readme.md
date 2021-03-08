
# React native version and env manager

Manage version/buildNumber in your react native app directly from `package.json` for both platforms (iOS && Android) with one command
```
node node_modules/react-native-version-env-manager --updateVersion'
```

For switching to a different env
```
node node_modules/react-native-version-env-manager --env=dev
```

## Installation
```
yarn add react-native-version-env-manager
```

Or via npm:
```
npm install react-native-version-env-manager --save
```

## Usage
**1. Add command in the section `scripts` in the `package.json`**
```json
{
  "name": "your-project-name",
  "scripts": {
    "updateVersion": "node node_modules/react-native-version-env-manager --updateVersion",
  }
}
```

**2. Make sure you have defined the version and buildNumber**
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "buildNumber": 1,
  "scripts": {
    "updateVersion": "node node_modules/react-native-version-env-manager --updateVersion",
  }
}
```

**3. Increase version when needed**
```json
{
  "version": "1.0.1",
  "buildNumber": 2,
}
```bash
yarn updateVersion
```

Or via npm:
```bash
npm run updateVersion
```
## Options
You can pass option name and value with following syntax (remember to put `--` before options if you are using npm, with yarn this is not needed):
```
yarn updateVersion --flag value
```

| **Option** | **Type** | **Default value** | **Description** |
|------------|----------|-------------------|-----------------|
| **`--pathToPackage './path'`** | `string` | `./package.json` | Path to `package.json` file in your project. |
| **`--pathToPlist './path'`** | `string` | `./ios/${package.name}/Info.plist` | Path to `Info.plist` file (ios project). |
| **`--pathToGradle './path'`** | `string` | `./android/app/build.gradle` | Path to `build.gradle` file (android project). |
