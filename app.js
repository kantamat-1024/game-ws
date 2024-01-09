// app.js

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);

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

// configure express app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('S3CRE7'));
app.use(flash());
app.use(session({ secret: 'S3CRE7-S3SSI0N', saveUninitialized: true, resave: true }));
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

// Promiseベースの非同期処理
app.get('/', async (req, res) => {
  const games = await getGames(client);
  res.render('index', {games});
});

async function getGames(client) {
  // ...
}

async function start() {
  await client.connect();

  // アプリケーション起動

  await client.close();
}

start();

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;