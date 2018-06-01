# koa-mongo-driver

[![NPM version][npm-version]][npm-url]
[![Node.js Version][node-version]](http://nodejs.org/download/)

>MongoDB middleware developed on top of official node-mongodb-native.

## Installation

#### NPM
```
npm install koa-mongo-driver --save
```

#### Yarn
```
yarn add koa-mongo-driver
```

## Basic Usage
```js
const Koa = require('koa');
const app = new Koa();

const mongo = require('koa-mongo-driver');

app.use(mongo());
app.use(async (ctx) => {
  const collection = ctx.mongo.db('test').collection('objects');

  ctx.body = await collection.insertOne({ content: 'Just another object.' });
});

app.listen(3000);
```

See [spec/koa-example.js](./spec/koa-example.js) to check a simple Koa application.

## Custom URL Configurations
The `mongo()` function accepts as first argument an object that is used to define the connection URL for the MongoDB instance.

The `host`, `port`, and `databaseName` can be passed as described in the example below:

```js
const Koa = require('koa');
const app = new Koa();

const mongo = require('koa-mongo-driver');

const urlOptions = {
  url: 'my-mongodb-selfhosted.com',
  port: 12345,
  databaseName: 'myDatabase'
};

app.use(mongo(urlOptions));
app.use(async (ctx) => {
  const collection = ctx.mongo.db('test').collection('objects');

  ctx.body = await collection.insertOne({ content: 'Just another object.' });
});

app.listen(3000);
```

## Custom Connection Configurations
The `mongo()` function accepts as **second argument** an object that is used to define the *MongoClient* options.

Any configuration accepted by the `node-mongodb-native` can be passed. Check the available settings on [MongoClient API Docs by MongoDB](http://mongodb.github.io/node-mongodb-native/3.0/api/MongoClient.html#.connect).

The next example describes how to open an authenticated connection.

```js
const Koa = require('koa');
const app = new Koa();

const mongo = require('koa-mongo-driver');

const urlOptions = {
  url: 'my-mongodb-selfhosted.com',
  port: 12345,
  databaseName: 'myDatabase'
};

const connectionOptions = {
  auth: {
    user: 'root',
    password: 'toor'
  },
  authSource: 'admin',
  authMechanism: 'PLAIN'
};

app.use(mongo(urlOptions, connectionOptions));
app.use(async (ctx) => {
  const collection = ctx.mongo.db('test').collection('objects');

  ctx.body = await collection.insertOne({ content: 'Just another object.' });
});

app.listen(3000);
```

[npm-url]: https://www.npmjs.com/package/koa
[npm-version]: https://img.shields.io/npm/v/koa-mongo-driver.svg?style=flat-square
[node-version]: https://img.shields.io/node/v/koa-mongo-driver.svg?style=flat
