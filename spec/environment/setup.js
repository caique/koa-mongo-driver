/* eslint new-cap: "off" */
const MongoDBInMemoryServer = require('mongodb-memory-server');

const DB_NAME = 'test';

const mongod = new MongoDBInMemoryServer.default({
  instance: {
    dbName: DB_NAME,
  },
  binary: {
    version: '3.6.5',
  },
});

module.exports = () => {
  global.MONGOD = mongod;
  global.MONGO_DB_NAME = DB_NAME;
};
