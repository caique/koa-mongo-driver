const mongo = require('lib/mongo');

describe('mongo', () => {
  it('pass', async () => {
    await mongo()();
  });
});
