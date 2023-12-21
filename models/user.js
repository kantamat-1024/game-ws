var mongoose = require('mongoose');
// mongooseモジュールを読み込みます。mongooseはMongoDBを操作するためのNode.jsライブラリです。

var util = require('../config/util.js');
// 暗号化などのユーティリティ関数を含むutil.jsモジュールを読み込みます。

var UserSchema = mongoose.Schema({
    // 新しいスキーマ（UserSchema）を定義します。
    name: String,
    // nameフィールドは、ユーザーの名前を表す文字列です。
    email: String,
    // emailフィールドは、ユーザーのメールアドレスを表す文字列です。
    password: String,
    // passwordフィールドは、ユーザーのパスワードを表す文字列です。
    lastConnection: { type: Date, default: Date.now }
    // lastConnectionフィールドは、最後の接続日時を表す日付型で、デフォルト値は現在の日時です。
});

UserSchema.methods = {
    // UserSchemaにメソッドを追加します。

    authenticate: function (plainText) {
        // authenticateメソッドは、平文のパスワードを受け取ります。
        return util.encrypt(plainText) == this.password;
        // 与えられた平文のパスワードを暗号化し、保存されているパスワードと比較します。
    }
};

mongoose.model('User', UserSchema);
// 定義したスキーマ（UserSchema）を使用して、'User'という名前のモデルを作成し、mongooseに登録します。
