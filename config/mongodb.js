// MongoDB接続設定
const mongoose = require('mongoose');
const config = require('config');

// コネクションプールの設定
const options = {
  poolSize: 10, 
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000
};

mongoose.connect(config.mongodb.uri, options);

// エラーハンドリング
mongoose.connection.on('error', err => {
  console.error(err);
});

module.exports = mongoose.connection; 