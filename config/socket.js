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
      topRatedGame = new Chess();
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

    /*
     * Socket IO event handlers
     */
    ioServer.on('connection', function (socket) {
        // 新しいユーザーが接続したときのイベントハンドラ。

        var username = socket.handshake.query.user;
        // 接続したユーザーの名前を取得します。

        users++;
        monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
        // ユーザー数を更新し、モニタリング用のクライアントに通知します。

        // 以下、'join', 'new-move', 'resign', 'disconnect'などのイベントハンドラを定義します。
        // 各イベントはゲームの参加、新しい動きの通知、降参、接続解除などを処理します。
    });

    /*
     * Utility function to find the player name of a given side.
     */
    function getPlayerName(room, side) {
        // 特定のゲームとサイド（白か黒）に基づいてプレイヤーの名前を検索するユーティリティ関数。
        var game = games[room];
        for (var p in game.players) {
            var player = game.players[p];
            if (player.side === side) {
                return player.name;
            }
        }
    }
  });
}
