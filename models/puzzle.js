var mongoose = require('mongoose');
// mongooseモジュールを読み込みます。mongooseはMongoDBを操作するためのNode.jsライブラリです。

var PuzzleSchema = mongoose.Schema({
    // 新しいスキーマ（PuzzleSchema）を定義します。
    content: String,
    // contentフィールドは、パズルの内容を表す文字列です。
    solution: String,
    // solutionフィールドは、パズルの解答を表す文字列です。
    comment: String
    // commentフィールドは、パズルに対する追加的なコメントや説明を表す文字列です。
});

// モデルの定義
const Puzzle = mongoose.model('Puzzle', PuzzleSchema);

// 非同期のクエリ
const main = async () => {
  const puzzles = await Puzzle.find({});
} 

main();