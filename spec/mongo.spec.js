const uuid = require('uuid-random');
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

    it('connects with useNewUrlParser', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo()(ctx, next);

      expect(ctx.mongo.s.options.useNewUrlParser).toBeTruthy();
      expect(next).toHaveBeenCalled();
    });

    it('persists an object', async () => {
      const ctx = {};

      const next = jest.fn(async () => {
        const collection = ctx.mongo.db(uuid()).collection('objects');

        const sampleObject = { _id: 'some-id', content: 'This is a sample object.' };
        await collection.insertOne(sampleObject);

        const retrievedObject = await collection.findOne({ _id: 'some-id' });

        expect(retrievedObject).toEqual(sampleObject);
      });

      await mongo()(ctx, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('using user options', () => {
    it('builds URL with host passed via userOptions', async () => {
      const userOptions = {
        host: '127.0.0.1',
      };

      const next = jest.fn();
      const ctx = {};

      await mongo(userOptions)(ctx, next);

      expect(ctx.mongo.s.url).toBe('mongodb://127.0.0.1:27017/test');
      expect(next).toHaveBeenCalled();
    });

    it('builds URL with port passed via userOptions', async () => {
      const userOptions = {
        port: '27017',
      };

      const next = jest.fn();
      const ctx = {};

      await mongo(userOptions)(ctx, next);

      expect(ctx.mongo.s.url).toBe('mongodb://localhost:27017/test');
      expect(next).toHaveBeenCalled();
    });

    it('builds URL with database name passed via userOptions', async () => {
      const userOptions = {
        databaseName: 'another-database-name',
      };

      const next = jest.fn();
      const ctx = {};

      await mongo(userOptions)(ctx, next);

      expect(ctx.mongo.s.url).toBe('mongodb://localhost:27017/another-database-name');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('when connection fails', () => {
    const userOptions = {
      host: 'bad-host-to-break',
    };

    it('does not calls next', async () => {
      const next = jest.fn();

      await mongo(userOptions)({}, next);

      expect(next).toHaveBeenCalledTimes(0);
    });

    it('does not assign a connection to context', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo(userOptions)(ctx, next);

      expect(ctx.mongo).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(0);
    });

    it('sets body with error message', async () => {
      const next = jest.fn();
      const ctx = {};

      await mongo(userOptions)(ctx, next);

      expect(ctx.body.success).toBeFalsy();
      expect(ctx.body.message).toEqual('Connection to MongoDB could not be estabilished.');
      expect(ctx.body.error).toBeDefined();
      expect(next).toHaveBeenCalledTimes(0);
    });
  });
});
