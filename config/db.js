const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/chesshub';

module.exports = {
  url: mongoUrl
};