var express = require('express');
// Expressフレームワークを読み込みます。

var mongoose = require('mongoose');
// Mongoose（MongoDB用のODMライブラリ）を読み込みます。

var util = require('../config/util.js');
// 暗号化やその他ユーティリティ関数を含むutil.jsモジュールを読み込みます。

var router = express.Router();
// 新しいExpressルーターを作成します。

var moment = require('moment');
// 日付操作ライブラリであるmomentを読み込みます。

/* GET user account details. */
router.get('/', async (req, res) => {
    // ユーザーアカウントの詳細を表示するためのGETリクエストのルートを定義します。
    res.render('partials/account', {
        // 'partials/account'テンプレートをレンダリングします。
        title: 'Chess Hub - Account',
        // ページタイトルを設定します。
        user: req.user,
        // 現在のユーザー情報を渡します。
        isAccountPage: true,
        // アカウントページであることを示すフラグを設定します。
        lastConnection: moment(req.user.lastConnection).fromNow(),
        // 最終接続時刻を相対的な表現で設定します。
        updateStatus: req.flash('updateStatus'),
        // パスワード更新のステータスメッセージを取得します。
        updateMessage: req.flash('updateMessage')
        // パスワード更新時のメッセージを取得します。
    });
});

/* Update user account. */
router.post('/', async (req, res) => {
    // ユーザーアカウントの更新を行うPOSTリクエストのルートを定義します。
    var User = mongoose.model('User');
    // Userモデルを取得します。
    var currentPassword = req.body.password;
    // 現在のパスワードを取得します。
    var newPassword = req.body.newPassword;
    // 新しいパスワードを取得します。
    var confirmNewPassword = req.body.confirmNewPassword;
    // 新しいパスワードの確認入力を取得します。
    var hash = util.encrypt(currentPassword);
    // 現在のパスワードを暗号化します。
    if (hash === req.user.password) {
        // 現在のパスワードが正しい場合の処理。
        if (newPassword === confirmNewPassword) {
            // 新しいパスワードとその確認が一致する場合。
            var newPasswordHash = util.encrypt(newPassword);
            // 新しいパスワードを暗号化します。
            User.findOneAndUpdate({_id: req.user._id}, { password: newPasswordHash }, {}, function (err, user) {
                // パスワードを更新します。
                req.user = user;
                // 更新されたユーザー情報を設定します。
                req.flash('updateStatus', true);
                // 更新成功のステータスを設定します。
                req.flash('updateMessage', 'Your password has been updated successfully');
                // 成功メッセージを設定します。
                res.redirect('/account');
                // アカウントページにリダイレクトします。
            });
        } else {
            // 新しいパスワードとその確認が一致しない場合。
            req.flash('updateStatus', false);
            // 更新失敗のステータスを設定します。
            req.flash('updateMessage', 'The confirmation password does not match the new password');
            // エラーメッセージを設定します。
            res.redirect('/account');
            // アカウントページにリダイレクトします。
        }
    } else {
        // 現在のパスワードが間違っている場合。
        req.flash('updateStatus', false);
        // 更新失敗のステータスを設定します。
        req.flash('updateMessage', 'The current password is incorrect');
        // エラーメッセージを設定します。
        res.redirect('/account');
        // アカウントページにリダイレクトします。
    }
});

module.exports = router;
// 定義したルーターをエクスポートします。
