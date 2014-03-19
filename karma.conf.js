module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha','chai'],
    files: [
      'dist/**/*.js',
      'test/**/*.js'
    ],

    reporters: ['dots'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    captureTimeout: 60000,
    singleRun: false,
    
    browsers: ['Chrome'] // 'Firefox', 'PhantomJS'
  })

}
