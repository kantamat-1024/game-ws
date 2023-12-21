var config = require('config');

module.exports = function (app, mongoose) {

    var connect = function () {
        var options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        mongoose.connect(config.get('chesshub.db'), options);
    };
    connect();

    // Error handler
    mongoose.connection.on('error', function (err) {
        console.error('MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err);
    });

    // Reconnect when closed
    mongoose.connection.on('disconnected', function () {
        connect();
    });

};
