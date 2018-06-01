const { MongoError, MongoNetworkError } = require('mongodb');

const mongo = require('lib/mongo');

describe('mongo', () => {
  describe('using default options', () => {
    it('calls next function', async () => {
      const next = jest.fn();

      await mongo()({}, next);

      expect(next).toHaveBeenCalled();
    });

    it('add connection to context', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo()(ctx, next);

      expect(ctx.mongo).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('connects using default URL', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo()(ctx, next);

      expect(ctx.mongo.s.url).toBe('mongodb://localhost:27017/test');
      expect(next).toHaveBeenCalled();
    });

    it('persists an object', async () => {
      const ctx = {};

      const next = jest.fn(async () => {
        const collection = ctx.mongo.db('test').collection('objects');

        const sampleObject = { content: 'Just a sample object.' };

        await collection.insertOne(sampleObject);
        const retrievedObject = await collection.findOne(sampleObject);
        await collection.removeMany(sampleObject);

        expect(retrievedObject.content).toEqual(sampleObject.content);
      });

      await mongo()(ctx, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('passing url options', () => {
    it('builds with host passed via urlOptions', async () => {
      const urlOptions = {
        host: '127.0.0.1',
      };

      const next = jest.fn();
      const ctx = {};

      await mongo(urlOptions)(ctx, next);

      expect(ctx.mongo.s.url).toBe('mongodb://127.0.0.1:27017/test');
      expect(next).toHaveBeenCalled();
    });

    it('builds with port passed via urlOptions', async () => {
      const urlOptions = {
        port: '27017',
      };

      const next = jest.fn();
      const ctx = {};

      await mongo(urlOptions)(ctx, next);

      expect(ctx.mongo.s.url).toBe('mongodb://localhost:27017/test');
      expect(next).toHaveBeenCalled();
    });

    it('builds with database name passed via urlOptions', async () => {
      const urlOptions = {
        databaseName: 'another-database-name',
      };

      const next = jest.fn();
      const ctx = {};

      await mongo(urlOptions)(ctx, next);

      expect(ctx.mongo.s.url).toBe('mongodb://localhost:27017/another-database-name');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('passing connection options', () => {
    it('connects with useNewUrlParser by default', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo()(ctx, next);

      expect(ctx.mongo.s.options.useNewUrlParser).toBeTruthy();
      expect(next).toHaveBeenCalled();
    });

    it('connects with properties from connectionOptions', async () => {
      const connectionOptions = {
        useNewUrlParser: false,
      };

      const next = jest.fn();
      const ctx = {};

      await mongo({}, connectionOptions)(ctx, next);

      expect(ctx.mongo.s.options.useNewUrlParser).toBeFalsy();
      expect(next).toHaveBeenCalled();
    });

    it('try to authenticate with credentials from connectionOptions', async () => {
      const connectionOptions = {
        auth: {
          user: 'wrong-user',
          password: 'wrong-password',
        },
      };

      const next = jest.fn();
      const ctx = {};

      await mongo({}, connectionOptions)(ctx, next);

      expect(ctx.mongo).toBeUndefined();
      expect(ctx.body.success).toBeFalsy();
      expect(ctx.body.message).toEqual('Authentication failed.');
      expect(ctx.body.error).toEqual(new MongoError('Authentication failed.'));
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe('when connection fails', () => {
    const urlOptions = {
      host: 'bad-host-to-break',
    };

    it('does not calls next', async () => {
      const next = jest.fn();

      await mongo(urlOptions)({}, next);

      expect(next).toHaveBeenCalledTimes(0);
    });

    it('does not assign a connection to context', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo(urlOptions)(ctx, next);

      expect(ctx.mongo).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(0);
    });

    it('sets body with error message', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo(urlOptions)(ctx, next);

      expect(ctx.body.success).toBeFalsy();
      expect(ctx.body.message).toEqual('failed to connect to server [bad-host-to-break:27017] on first connect [MongoNetworkError: getaddrinfo ENOTFOUND bad-host-to-break bad-host-to-break:27017]');
      expect(ctx.body.error).toEqual(new MongoNetworkError('failed to connect to server [bad-host-to-break:27017] on first connect [MongoNetworkError: getaddrinfo ENOTFOUND bad-host-to-break bad-host-to-break:27017]'));

      expect(next).toHaveBeenCalledTimes(0);
    });
  });
});
