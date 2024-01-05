var mongoose = require('mongoose')
// mongooseモジュール（MongoDBのためのODM）を読み込みます。

Schema = mongoose.Schema;
// mongooseからSchemaコンストラクタを参照します。

var GameSchema = mongoose.Schema({
    // 新しいスキーマを定義します。このスキーマはゲームのデータ構造を表します。
    user: { type: Schema.ObjectId, ref: 'User' },
    // userフィールドは、'User'モデルへの参照を持つObjectIdです。
    white: String,
    // whiteフィールドは白い駒を使用するプレイヤーの名前を格納するための文字列型です。
    black: String,
    // blackフィールドは黒い駒を使用するプレイヤーの名前を格納するための文字列型です。
    pgn: String,
    // pgnフィールドは、ゲームの動きを記録するための文字列型です（Portable Game Notationの略）。
    result: String
    // resultフィールドは、ゲームの結果を格納するための文字列型です。
});

const Game = mongoose.model('Game', GameSchema);

// モデルのクエリを非同期に
const main = async () => {
  const games = await Game.find({});
  // gamesを利用する
}

main();