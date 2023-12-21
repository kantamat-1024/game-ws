var crypto = require('crypto');
// Node.jsの標準ライブラリであるcryptoモジュールを読み込みます。

module.exports = {
    // このモジュールは2つの関数をエクスポートします。

    encrypt: function (plainText) {
        // 平文を受け取り、MD5ハッシュアルゴリズムを使用して暗号化する関数。
        return crypto.createHash('md5').update(plainText).digest('hex');
        // MD5ハッシュを生成し、16進数の文字列として返します。
    },

    randomString: function (length) {
        // 指定された長さのランダムな文字列を生成する関数。
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
        // 使用する文字のセット。

        var string = '';
        // 生成される文字列を初期化します。

        for (var i = 0; i < length; i++) {
            // 指定された長さの文字列を生成するためにループします。
            var randomNumber = Math.floor(Math.random() * chars.length);
            // ランダムなインデックスを生成します。
            string += chars.substring(randomNumber, randomNumber + 1);
            // 対応する文字を文字列に追加します。
        }

        return string;
        // 完成したランダム文字列を返します。
    }
};
