const { MongoClient } = require('mongodb');

const defaultOptions = {
  host: 'localhost',
  port: 27017,
  databaseName: 'test',
};

const buildMongoURL = options => `mongodb://${options.host}:${options.port}/${options.databaseName}`;

const close = (connection) => {
  if (connection) connection.close();
};

const mongo = (userOptions) => {
  const options = Object.assign({}, defaultOptions, userOptions);

  const mongoURL = buildMongoURL(options);

  return async (ctx, next) => MongoClient.connect(mongoURL, { useNewUrlParser: true })
    .then(async (connection) => {
      ctx.mongo = connection;
      await next();
    })
    .then(async () => {
      await close(ctx.mongo);
    })
    .catch(async (error) => {
      ctx.body = {
        success: false,
        message: 'Connection to MongoDB could not be estabilished.',
        error,
      };

      await close(ctx.mongo);
    });
};

module.exports = mongo;
