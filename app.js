var fs = require('fs');
var express = require('express');
var http = require('http');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
const mongoose = require('mongoose');

// Expressアプリケーション作成
const app = express(); 

// データベース接続 
mongoose.connect(url)
  .then(() => {
    // モデル定義
    const Game = mongoose.model('Game', GameSchema);

    // サーバーの定義
    const server = http.createServer(app);

    // サーバー起動時に接続を待機
    server.listen(3000, async() => {
      await mongoose.connection;
      console.log('Server listening on port 3000');
    });

  })
  .catch(err => {
    console.error(err);
  });

// configure express app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('S3CRE7'));
app.use(flash());
app.use(session({ secret: 'S3CRE7-S3SSI0N', saveUninitialized: true, resave: true } ));
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport')(app, passport);
app.use(passport.initialize());
app.use(passport.session());

// configure routes
var routes = require('./routes/index');
var account = require('./routes/account');
var api = require('./routes/api');
var play = require('./routes/play');
var login = require('./routes/login');
var register = require('./routes/register');
var search = require('./routes/search');

app.use('/', routes);
app.use('/login', login);
app.use('/register', register);
app.use('/account', account);
app.use('/play', play);
app.use('/api', api);
app.use('/search', search);

// configure error handlers
require('./config/errorHandlers.js')(app);

// ルートハンドラを非同期に
app.get('/', async (req, res) => {
    const games = await Game.find({});
    res.render('index', {games}); 
  });
  
  // モデルのクエリをPromiseベースに
  Game.find({})
    .then(games => {
      // gamesを利用
    })
    .catch(err => {
      console.error(err); 
    });


module.exports = app;
