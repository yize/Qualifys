var env = {};

env.envCheck = function () {
  var colors = require('colors').setTheme({
    warn: ['red'],
    info: ['blue']
  });

  // if npm is not ready
  var fs = require('fs');

  // if git is ready
  try {
    var status = fs.statSync(process.cwd() + '/.git');
  } catch (err) {
    showErr(err.message);
    if (err.message.indexOf('no such file or directory') > 0) {
      this.initGit();
    }
  }

  try {
    var status = fs.statSync(process.cwd() + '/package.json');
  } catch (err) {
    showErr(err.message);
    if (err.message.indexOf('package.json') > 0
      && err.message.indexOf('no such file or directory') > 0 ) {
      this.initNpm();
    }
  }
}

var installDev = function (list) {
  var info = require(process.cwd() + '/package.json');
  list.forEach(function (name) {
    if (!info['devDependencies'] || !info['devDependencies'][name]) {
      console.log('Install lost devDependencies: '.info + name);
      require('child_process').spawnSync('npm', ['install', '--save-dev', name], { stdio: 'inherit' });
    }
  });
}

// @todo may cause conflicts when we have newer versions of packages
var linterDevList = [
  'eslint',
  'eslint-config-airbnb',
  'eslint-plugin-import',
  'eslint-plugin-react',
  'eslint-plugin-jsx-a11y'
];

// @todo may cause conflicts when we have newer versions of packages
var testRunnerList = [
  'expect.js',
  'babel-loader',
  'mocha',
  'react-addons-test-utils',
  'enzyme'
];

env.checkLinter = function () { installDev(linterDevList); };
env.checkTester = function () { installDev(testRunnerList); };

env.initNpm = function () {
  console.log('===== Initialized NPM ====='.info);
  require('child_process').spawnSync('npm', ['init'], { stdio: 'inherit' });
};

env.initGit = function () {
  console.log('===== Initialized Git ====='.info);
  require('child_process').spawnSync('git', ['init'], { stdio: 'inherit' });
};

function showErr(msg) {
  console.log(('===== ERROR ===== \n' + msg).warn);
}

module.exports = env;
