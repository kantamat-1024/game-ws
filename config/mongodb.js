// 接続設定
const mongoose = require('mongoose');
const config = require('config');

// コネクションプールの設定
const options = {
  poolSize: 50,
  socketTimeoutMS: 30000, 
  connectTimeoutMS: 30000,
  reconnectTries: 30, // リトライ回数
  reconnectInterval: 1000 // リトライ間隔(ミリ秒)
};

// 接続処理
mongoose.connect(config.mongodb.uri, options); 

// リトライロジック
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Retrying connection...');
  setTimeout(() => {
    mongoose.connect(config.mongodb.uri, options);
  }, options.reconnectInterval);
});

// エラーハンドリング
mongoose.connection.on('error', err => {
  console.error(err);
});

module.exports = mongoose.connection;