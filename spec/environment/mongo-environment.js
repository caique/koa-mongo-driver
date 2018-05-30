/* eslint no-console: "off" */
const NodeEnvironment = require('jest-environment-node');

class MongoEnvironment extends NodeEnvironment {
  async setup() {
    console.log('Starting MongoDB Test Environment');

    this.global.MONGO_URI = await global.MONGOD.getConnectionString();
    this.global.MONGO_DB_NAME = global.MONGO_DB_NAME;

    await super.setup();
  }

  async teardown() {
    console.log('Shutting down MongoDB Test Environment');

    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;
