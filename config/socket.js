// Socket.IO v3をインポート
const io = require('socket.io');

module.exports = function(server) {

 // サーバーを使ってSocket.IOサーバーを作成
 const ioServer = io(server);

 // chess.jsをインポート
 const chess = require('chess.js');

 // トップレーティングゲームのチェス盤を作成
 const topRatedGame = new chess.Chess();

 // トップレーティングゲーム用の名前空間
 const tvNamespace = ioServer.of('/tv');

 // トップレーティングゲームの状態を定期的に送信
 setInterval(() => {

   var possibleMoves = topRatedGame.moves();

   if (topRatedGame.game_over() || topRatedGame.in_draw() || possibleMoves.length === 0) {
     topRatedGame = new chess.Chess();
     possibleMoves = topRatedGame.moves();
   }

   const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
   topRatedGame.move(move);

   tvNamespace.emit('new-top-rated-game-move', {
     fen: topRatedGame.fen(),
     pgn: topRatedGame.pgn(),
     turn: topRatedGame.turn()
   });

 }, 3000);

 // トップレーティングゲームの名前空間の接続時に状態を送信
 tvNamespace.on('connection', socket => {
   socket.emit('new-top-rated-game-move', {
     fen: topRatedGame.fen(),
     pgn: topRatedGame.pgn(),
     turn: topRatedGame.turn()
   });
 });

 // ゲームとユーザー数を保持する変数
 const games = {};
 let users = 0;

 // モニタリング用の名前空間
 const monitorNamespace = ioServer.of('/monitor');

 // モニタリング名前空間の接続時に現在の状態を送信
 monitorNamespace.on('connection', socket => {
   socket.emit('update', {
     nbUsers: users,
     nbGames: Object.keys(games).length
   });
 });

 // メインのSocket.IOサーバーへの接続時
 ioServer.on('connection', socket => {

   // ユーザー名を取得
   const username = socket.handshake.query.user;

   // ユーザー数を更新
   users++;

   // モニタリング名前空間に現在の状態を送信
   monitorNamespace.emit('update', {
     nbUsers: users,
     nbGames: Object.keys(games).length
   });

   // ゲーム参加時
   socket.on('join', function(data) {
     // ゲームルーム名
     const room = data.token;

     // ゲームがまだない場合は初期化
     if (!games[room]) {
       games[room] = {
         room: room,
         creator: socket,
         status: 'waiting',
         creationDate: Date.now(),
         players: [
           {
             socket: socket,
             name: username,
             status: 'joined',
             side: data.side
           },
           {
             socket: null,
             name: "",
             status: 'open',
             side: data.side === "black" ? "white" : "black"
           }
         ]
       };

       socket.join(room);
       socket.emit('wait');
       return;
     }

     // 2人目のプレイヤーが参加
     games[room].players[1].socket = socket;
     games[room].players[1].name = username;
     games[room].players[1].status = 'joined';
     games[room].status = 'ready';

     socket.join(room);
     io.sockets.to(room).emit('ready', {
       white: getPlayerName(room, 'white'),
       black: getPlayerName(room, 'black')  
     });
   });

   // 新しい手の通知
   socket.on('new-move', function(data) {
     socket.broadcast.to(data.token).emit('new-move', data);
   });

   // 降参時
   socket.on('resign', function(data) {
     const room = data.token;
     if (room in games) {
       io.sockets.to(room).emit('player-resigned', {
         side: data.side
       });
       delete games[room];
       
       games[room].players[0].socket.leave(room);
       games[room].players[1].socket.leave(room);

       monitorNamespace.emit('update', {
         nbUsers: users,
         nbGames: Object.keys(games).length
       });
     }
   });

   // 切断時
   socket.on('disconnect', function() {
     users--;

     for (let token in games) {
       const game = games[token];
       for (let p in game.players) {
         const player = game.players[p];
         if (player.socket === socket) {
           socket.broadcast.to(token).emit('opponent-disconnected');
           delete games[token];

           monitorNamespace.emit('update', {
             nbUsers: users,
             nbGames: Object.keys(games).length
           });
         }
       }
     }
   });

 });

 // プレイヤー名を取得
 const getPlayerName = (room, side) => {
   const game = games[room];
   for (let p in game.players) {
     const player = game.players[p];
     if (player.side === side) {
       return player.name;
     }
   }
 }

}