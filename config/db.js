const config = require('config'); const mongoose = require('mongoose');
// mongodb.dbの設定値を取得
const db = config.get('chesshub.db');

const options = {
poolSize: config.get('chesshub.poolSize'),
socketTimeoutMS: config.get('chesshub.socketTimeoutMS'),
connectTimeoutMS: config.get('chesshub.connectTimeoutMS'),
reconnectTries: config.get('chesshub.reconnectTries'),
reconnectInterval: config.get('chesshub.reconnectInterval')
};

// mongodb.dbの設定値を使って接続
mongoose.connect(db, options);