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
var u = new User({ name: 'Foo', email: 'foo@bar.org', lastConnection: 'Sun Nov 02 2014 11:16:56 GMT+0100 (CET)', password: '3858f62230ac3c915f300c664312c63f'  });
u.save().then(() => console.log('User saved successfully')).catch(err => console.error('Error saving user:', err));

// 名言データの作成と保存
var q1 = new Quote({author: 'Garry Kasparov', content: 'The highest art of the chess player lies in not allowing your opponent to show you what he can do.'});
var q2 = new Quote({author: 'Boris Spassky', content: 'The best indicator of a chess player form is his ability to sense the climax of the game.'});
var q3 = new Quote({author: 'V. Anand', content: 'Nowadays, when you are not a grandmaster at 14, you can forget about it.'});
var q4 = new Quote({author: 'Magnus Carlsen', content: 'Some people think that if their opponent plays a beautiful game, it’s OK to lose. I don’t. You have to be merciless.'});

Promise.all([q1.save(), q2.save(), q3.save(), q4.save()])
    .then(() => console.log('Quotes saved successfully'))
    .catch(err => console.error('Error saving quotes:', err));

// パズルデータの作成と保存
var p1 = new Puzzle({content: '1r6/4b2k/1q1pNrpp/p2Pp3/4P3/1P1R3Q/5PPP/5RK1 w', solution: '1.Qxh6+ 1…Kxh6 2.Rh3# 1…Kg8 2.Qg7#', comment: 'White to move, mate in 2'});
var p2 = new Puzzle({content: '2q1nk1r/4Rp2/1ppp1P2/6Pp/3p1B2/3P3P/PPP1Q3/6K1 w', solution: '1.Rxe8+ Qxe8 2.Bxd6+ Qe7 3.Qxe7+ Kg8 4.Qf8+ Kh7 5.Qxf7#', comment: 'White to move, mate in 5'});
var p3 = new Puzzle({content: '1r3r1k/5Bpp/8/8/P2qQ3/5R2/1b4PP/5K2 w', solution: '1.Qxh7+! Kxh7 2.Rh3+ Qh4 3.Rxh4#', comment: 'White to move, mate in 3'});

Promise.all([p1.save(), p2.save(), p3.save()])
    .then(() => console.log('Puzzles saved successfully'))
    .catch(err => console.error('Error saving puzzles:', err));

// ゲームデータの作成と保存
User.findOne({ email: 'foo@bar.org' }).then(user => {
    var fooId = user.id;
    var g1 = new Game({
        user: fooId,
        white: "Foo",
        black: "Anonymous",
        pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. O-O Bc5 5. c3 O-O 6. d4 exd4 7. cxd4 Bb4",
        result: "1-0"
    });

    var g2 = new Game({
        user: fooId,
        white: "Foo",
        black: "Anonymous",
        pgn: "1. e4 c6 2. e5 d5 3. exd6 exd6 4. Nf3 Bg4 5. d4 Nf6 6. Bg5 Be7",
        result: "1-0"
    });

    return Promise.all([g1.save(), g2.save()]);
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
    client.create({
        index: 'chesshub',
        type: 'game',
        id: '1',
        body: {
            white: "Foo",
            black: "Anonymous",
            content: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. O-O Bc5 5. c3 O-O 6. d4 exd4 7. cxd4 Bb4",
            result: "1-0"
        }
    }, function(){
        client.create({
            index: 'chesshub',
            type: 'game',
            id: '2',
            body: {
                white: "Anonymous",
                black: "Bar",
                content: "1. e4 c6 2. e5 d5 3. exd6 exd6 4. Nf3 Bg4 5. d4 Nf6 6. Bg5 Be7",
                result: "1-0"
            }
        }, function() {
            client.close();
        });
    });
});
