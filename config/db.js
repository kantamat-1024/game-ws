const config = require('config');
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/chesshub';

module.exports = {
  url: mongoUrl
};

const options = {
  poolSize: config.get('chesshub.poolSize'),
  socketTimeoutMS: config.get('chesshub.socketTimeoutMS'),
  connectTimeoutMS: config.get('chesshub.connectTimeoutMS'),
  reconnectTries: config.get('chesshub.reconnectTries'), 
  reconnectInterval: config.get('chesshub.reconnectInterval')
};

mongoose.connect(config.get('chesshub.db'), options);