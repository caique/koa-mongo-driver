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

  return async (ctx, next) => {
    try {
      ctx.mongo = await MongoClient.connect(mongoURL, { useNewUrlParser: true });
    } catch (error) {
      ctx.body = {
        success: false,
        error: 'Connection to MongoDB could not be estabilished.',
      };

      return;
    }

    await next();

    close(ctx.mongo);
  };
};

module.exports = mongo;
