# koa-mongo-driver

[![Package Version][npm-badge]][npm-url]
[![Node Version][node-badge]][node-url]
[![Codecov][codecov-badge]][codecov-url]
[![Build][travis-badge]][travis-url]

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

*You will need a MongoDB instance running to be able to use this package.*

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

[npm-badge]: https://img.shields.io/npm/v/koa-mongo-driver.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-mongo-driver

[node-badge]: https://img.shields.io/node/v/koa-mongo-driver.svg?style=flat
[node-url]: http://nodejs.org/download/

[codecov-badge]: https://codecov.io/gh/caique/koa-mongo-driver/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/caique/koa-mongo-driver

[travis-badge]: https://travis-ci.org/caique/koa-mongo-driver.svg?branch=master
[travis-url]: https://travis-ci.org/caique/koa-mongo-driver
