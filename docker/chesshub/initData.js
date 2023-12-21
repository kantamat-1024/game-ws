// モジュールの読み込み
var fs = require('fs');
var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('chesshub.db'));
// MongoDBデータベースに接続します。

// モデルの読み込み
fs.readdirSync(__dirname + '/models').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});
// '/models'ディレクトリ内のすべてのJavaScriptファイルを読み込みます。

// ユーザー、名言、パズル、ゲームデータの定義と保存
var User = mongoose.model('User');
var Puzzle = mongoose.model('Puzzle');
var Quote = mongoose.model('Quote');
var Game = mongoose.model('Game');

// ユーザーデータの作成と保存
var u = new User({ /*...ユーザーデータ...*/ });
u.save().then(() => console.log('User saved successfully')).catch(err => console.error('Error saving user:', err));

// 名言データの作成と保存
var q1 = new Quote({ /*...名言データ...*/ });
// 同様に他の名言データも作成
Promise.all([q1.save(), /*...他の名言の保存...*/])
    .then(() => console.log('Quotes saved successfully'))
    .catch(err => console.error('Error saving quotes:', err));

// パズルデータの作成と保存
var p1 = new Puzzle({ /*...パズルデータ...*/ });
// 同様に他のパズルデータも作成
Promise.all([p1.save(), /*...他のパズルの保存...*/])
    .then(() => console.log('Puzzles saved successfully'))
    .catch(err => console.error('Error saving puzzles:', err));

// ゲームデータの作成と保存
User.findOne({ email: 'foo@bar.org' }).then(user => {
    var fooId = user.id;
    var g1 = new Game({ /*...ゲームデータ...*/ });
    // 同様に他のゲームデータも作成
    return Promise.all([g1.save(), /*...他のゲームの保存...*/]);
}).then(() => mongoose.connection.close()).catch(err => {
    console.error(err);
    mongoose.connection.close();
});

// Elasticsearchサーバーの初期設定とデータ登録
var elasticsearch = require('elasticsearch');
var connectionString = "http://"+config.get('chesshub.es.host')+":"+config.get('chesshub.es.port');
var client = new elasticsearch.Client({ host: connectionString, log: 'trace' });

// Elasticsearchサーバーの状態確認
client.ping({ requestTimeout: 5000 }, function (error) {
    if (error) console.error('elasticsearch is down!');
    else console.log('elasticsearch is up and running!');
});

// Elasticsearchにインデックスとゲームデータを作成
client.indices.create({ index: 'chesshub' }, function() {
    client.create({ index: 'chesshub', type: 'game', id: '1', body: { /*...ゲームデータ...*/ } }, function() {
        // もう一つのゲームデータを登録
        client.create({ index: 'chesshub', type: 'game', id: '2', body: { /*...ゲームデータ...*/ } }, function() {
            client.close();
        });
    });
});
