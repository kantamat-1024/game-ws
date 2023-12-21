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

mongoose.model('Puzzle', PuzzleSchema);
// 定義したスキーマ（PuzzleSchema）を使用して、'Puzzle'という名前のモデルを作成し、mongooseに登録します。
