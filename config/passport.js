var mongoose = require('mongoose');
// mongooseモジュールを読み込みます。

var LocalStrategy = require('passport-local').Strategy;
// passport-localモジュールからLocalStrategyを読み込みます。

var User = mongoose.model('User');
// Mongooseを使用してUserモデルを取得します。

module.exports = function (app, passport) {
    // 外部からappとpassportオブジェクトを受け取る関数をエクスポートします。

    // serialize sessions
    passport.serializeUser(function(user, done) {
        // ユーザーセッションをシリアライズする方法を定義します。
        done(null, user.id);
        // ユーザーIDをセッションに保存します。
    });

    passport.deserializeUser(function(id, done) {
        // セッションからユーザーをデシリアライズする方法を定義します。
        User.findOne({ _id: id }, function (err, user) {
            // データベースからIDに一致するユーザーを検索します。
            done(err, user);
            // 検索結果を渡します。
        });
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
            // ユーザー名として'email'フィールドを、パスワードとして'password'フィールドを使用します。
        },
        function(email, password, done) {
            // ログイン試行時の挙動を定義します。

            User.findOne({ email: email }, function (err, user) {
                // データベースからメールアドレスに一致するユーザーを検索します。

                if (err) {
                    return done(err);
                    // エラーがあれば処理を中断します。
                }

                if (!user) {
                    return done(null, false, { message: 'This email is not registered' });
                    // ユーザーが見つからない場合はエラーメッセージを設定します。
                }

                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid login or password' });
                    // パスワードが一致しない場合はエラーメッセージを設定します。
                }

                return done(null, user);
                // ログイン成功時はユーザーオブジェクトを返します。
            });
        }
    ));
};
