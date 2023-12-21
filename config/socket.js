module.exports = function (server) {
    // この関数は外部からserverオブジェクトを受け取ります。

    var io = require('socket.io')(server);
    // Socket.IOモジュールを読み込み、サーバーにバインドします。

    var chess =  require('chess.js');
    // chess.jsライブラリを読み込みます。

    /*
     * live show of top rated game
     */
    var topRatedGame = new chess.Chess(); // 現在はダミーのゲーム。実際にはサーバー上でプレイされるゲームを使用するべきです。
    var tv = io.of('/tv'); // '/tv'パスでソケット接続を作成し、トップレートゲームの動きをブロードキャストします。

    setInterval(function() {
        // 3秒ごとにゲームの動きを生成し、クライアントに送信します。
        var possibleMoves = topRatedGame.moves();
        // 可能な動きのリストを取得します。

        // ゲームが終了している場合、新しいゲームをロードします。
        if (topRatedGame.game_over() === true || topRatedGame.in_draw() === true || possibleMoves.length === 0) {
            topRatedGame = new chess.Chess();
            possibleMoves = topRatedGame.moves();
        }

        var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        topRatedGame.move(move);
        tv.emit('new-top-rated-game-move', { fen: topRatedGame.fen(), pgn: topRatedGame.pgn(), turn: topRatedGame.turn() });
        // 新しい動きをクライアントに送信します。
    }, 3000);

    tv.on('connection', function(socket){
        // 新しいクライアントが接続したときに、現在のゲームの状態を送信します。
        socket.emit('new-top-rated-game-move', { fen: topRatedGame.fen(), pgn: topRatedGame.pgn(), turn: topRatedGame.turn() });
    });
    /*
     * End of live show of top rated game
     */

    var games = {};
    var users = 0;
    // 現在のゲームとユーザーの数を保持するための変数です。

    /*
     * Socket to use to broadcast monitoring events
     */
    var monitor = io.of('/monitor');
    monitor.on('connection', function(socket){
        // モニタリング用のソケット接続。現在のユーザー数とゲーム数を送信します。
        socket.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
    });

    /*
     * Socket IO event handlers
     */
    io.sockets.on('connection', function (socket) {
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

};
