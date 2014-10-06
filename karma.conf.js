module.exports = function(config, options) {
  config.set({
    frameworks: ['mocha','chai'],

    files: [
      'dist/cohesive.js',
      'test/common/*_test.js',
      'test/browser/*_test.js'
    ],

    preprocessors: { 'dist/cohesive.js': ['coverage'] },

    reporters: ['dots', 'coverage'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    captureTimeout: 60000,
    singleRun: false,
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],

    coverageReporter: {  dir : 'coverage/', type : 'html' },

    sauceLabs: {
      testName: 'cohesive.js',
      startConnect: true
    },

    customLaunchers: {
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome'
      },
      'SL_Firefox': {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '26'
      },
      'SL_Safari': {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.9',
        version: '7'
      },
      'SL_IE_7': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '7'
      },
      'SL_IE_8': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '8'
      },
      'SL_IE_9': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9'
      },
      'SL_IE_10': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2012',
        version: '10'
      },
      'SL_IE_11': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      }
    }
  })

  if (process.env.TRAVIS) {
    config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.startConnect = false;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.transports = ['xhr-polling'];
  }
}
