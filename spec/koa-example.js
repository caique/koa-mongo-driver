/* eslint no-console: "off" */
const Koa = require('koa');
const mongo = require('../lib/mongo');

const app = new Koa();

app.use(mongo());
app.use(async (ctx) => {
  const collection = ctx.mongo.db('test').collection('objects');

  const sampleObject = { content: 'Just another object.' };

  await collection.insertOne(sampleObject);

  ctx.body = await collection.findOne(sampleObject);

  await collection.removeMany(sampleObject);
});

app.listen(3000, () => {
  console.log('Koa Example App is listening on port 3000.');
});
