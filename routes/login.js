var express = require('express');
// Expressフレームワークを読み込みます。

var mongoose = require('mongoose');
// Mongoose（MongoDB用のODMライブラリ）を読み込みます。

var passport = require('passport');
// Passport認証ミドルウェアを読み込みます。

var User = mongoose.model('User');
// Mongooseを通じてUserモデルを取得します。

var router = express.Router();
// 新しいExpressルーターを作成します。

router.get('/', function(req, res) {
    // ログインページのGETリクエストのルートを定義します。
    var errors = req.flash('error');
    // エラーメッセージをフラッシュから取得します。
    var error = '';
    if (errors.length) {
        error = errors[0];
        // 最初のエラーメッセージを取得します。
    }

    res.render('partials/login', {
        // loginテンプレートをレンダリングします。
        title: 'Chess Hub - Login',
        error: error,
        isLoginPage: true
        // レンダリングに必要な変数を設定します。
    });
});

// ログイン処理
router.post('/', async (req, res, next) => {

    await passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login', 
      failureFlash: true 
    });
  
    const user = await User.findById(req.user.id);
  
    await user.updateLastLogin();
  
    req.flash('message', `Welcome ${user.name}!`);
  
    res.redirect('/');
  
  });
  
  // Userモデルにメソッドを追加  
  UserSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    await this.save();
  }
  
  module.exports = router;