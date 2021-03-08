const log = require('./lib/log');
const fs = require('fs');

module.exports = function (pathToEnv, envToSet) {
  // remove / at the end of the path
  pathToEnv = pathToEnv.charAt(-1) === '/' ? pathToEnv.slice(0, -1) : pathToEnv;
  // read the content of the specified env file
  // const envFileContent = require(`${pathToEnv}/${envToSet}.ts`);
  const envFileContent = fs.readFileSync(`${pathToEnv}/${envToSet}.ts`);
  // copy the json inside the env file
  fs.writeFileSync(`${pathToEnv}/env.ts`, envFileContent, 'utf8');
  // notify
  log.success('Environment set: ' + envToSet.toUpperCase());
};
