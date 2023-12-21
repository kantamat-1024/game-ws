FROM node:18.12.0
# Node.jsバージョン18.12.0の公式イメージをベースとして設定します。

ENV GITHUB_REPO=https://github.com/kantamat-1024/game-ws.git
# 環境変数GITHUB_REPOを設定し、GitHubリポジトリのURLを指定します。

RUN mkdir -p /var/www/app
# /var/www/appディレクトリを作成します。

WORKDIR /var/www/app
# 作業ディレクトリを/var/www/appに設定します。

RUN apt-get install -y git
# Gitをインストールします。

RUN git clone $GITHUB_REPO .
# 環境変数GITHUB_REPOで指定されたGitHubリポジトリをクローンします。

RUN npm install
# npmを使って依存関係をインストールします。

RUN npm install -g bower
RUN bower install
# bowerを使ってフロントエンドの依存関係をインストールします。

ADD ./config/default.json config/default.json
# ローカルのconfig/default.jsonファイルをコンテナのconfig/default.jsonに追加します。

ADD ./initData.js initData.js
# ローカルのinitData.jsファイルをコンテナのinitData.jsに追加します。

EXPOSE 3000
# コンテナのポート3000を公開します。

CMD node initData.js && node .
# コンテナ起動時にbower installを実行し、initData.jsスクリプトを実行し、その後Node.jsアプリケーションを起動します。
