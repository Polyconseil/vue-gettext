var webpackTestConfig = require("./webpack-test.config");

module.exports = function(config) {
  config.set({
    browsers: ["ChromeHeadless"],
    frameworks: ["mocha", "sinon-chai", "karma-typescript"],
    files: ["../test/index.ts"],
    preprocessors: {
      "../test/index.ts": ["karma-typescript"],
    },
    webpack: webpackTestConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    karmaTypescriptConfig: {
      tsconfig: "../tsconfig.json",
      coverageOptions: {
        exclude: /\.test\.ts?/,
      },
      compilerOptions: {
        target: "es2015",
      },
    },
  });
};
