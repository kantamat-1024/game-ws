var mongoose = require('mongoose');
// mongooseモジュールを読み込みます。mongooseはMongoDBを操作するためのNode.jsライブラリです。

var QuoteSchema = mongoose.Schema({
    // 新しいスキーマ（QuoteSchema）を定義します。
    author: String,
    // authorフィールドは、引用文の著者を表す文字列です。
    content: String
    // contentフィールドは、引用文の内容を表す文字列です。
});

mongoose.model('Quote', QuoteSchema);
// 定義したスキーマ（QuoteSchema）を使用して、'Quote'という名前のモデルを作成し、mongooseに登録します。
