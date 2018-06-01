module.exports = {
  bail: true,
  modulePaths: ['<rootDir>'],
  globalSetup: './spec/environment/setup.js',
  globalTeardown: './spec/environment/teardown.js',
  testEnvironment: './spec/environment/mongo-environment.js',
  coverageDirectory: './coverage/',
  collectCoverage: true,
};
