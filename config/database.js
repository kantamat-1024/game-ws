// 'config' モジュールをインポートします。これは、設定ファイルから設定を読み込むために使用されます。
var config = require('config');

// この関数は、app（Expressアプリケーション）とmongoose（MongoDBのためのODM）を引数として受け取ります。
module.exports = function (app, mongoose) {

    // MongoDBに接続するための関数を定義します。
    var connect = function () {
        // 接続オプションを定義します。`useNewUrlParser` と `useUnifiedTopology` は、接続の警告を避けるために推奨されるオプションです。
        var options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 50,
            socketTimeoutMS: 30000, 
            connectTimeoutMS: 30000,
            reconnectTries: 30, // リトライ回数
            reconnectInterval: 1000 // リトライ間隔(ミリ秒)
        };
        // mongooseを使用してMongoDBに接続します。接続情報は `config` モジュールから取得されます。
        mongoose.connect(config.get('chesshub.db'), options);
    };
    // 定義した接続関数を呼び出してMongoDBに接続を開始します。
    connect();

    // データベース接続にエラーが発生した場合に実行されるエラーハンドラを定義します。
    mongoose.connection.on('error', function (err) {
        // エラーをコンソールに出力します。
        console.error('MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err);
    });

    // データベース接続が切断されたときに実行されるイベントハンドラを定義します。
    mongoose.connection.on('disconnected', function () {
        // 切断された場合、再接続を試みるために接続関数を再度呼び出します。
        connect();
    });

};
