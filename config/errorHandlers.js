module.exports = function (app) {
    // この関数は外部からappオブジェクトを受け取ります。
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        // このミドルウェアは、リクエストが他のルートと一致しない場合（404）に動作します。
        var err = new Error('Not Found');
        // 'Not Found'というメッセージを持つ新しいエラーオブジェクトを作成します。
        err.status = 404;
        // エラーに404ステータスコードを設定します。
        next(err);
        // 次のミドルウェアにエラーを渡します。
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'default') {
        // 環境が'default'の場合のみ、このミドルウェアが動作します。
        app.use(function(err, req, res, next) {
            // エラーハンドリングミドルウェア。
            res.status(err.status || 500);
            // HTTPステータスコードをエラーのステータス、または500（サーバーエラー）に設定します。
            res.render('partials/error', {
                // 'partials/error'テンプレートをレンダリングします。
                message: err.message,
                // エラーメッセージをテンプレートに渡します。
                error: err
                // エラーオブジェクトをテンプレートに渡します（スタックトレースを含む）。
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        // 本番環境用のエラーハンドリングミドルウェア。
        res.status(err.status || 500);
        // HTTPステータスコードをエラーのステータス、または500に設定します。
        res.render('partials/error', {
            // 'partials/error'テンプレートをレンダリングします。
            message: err.message,
            // エラーメッセージをテンプレートに渡します。
            error: {}
            // ユーザーにスタックトレースを表示しないため、空のオブジェクトを渡します。
        });
    });

}
