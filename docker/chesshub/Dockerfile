FROM node:18.12.0

ENV GITHUB_REPO=https://github.com/kantamat-1024/game-ws.git

RUN mkdir -p /var/www/app
WORKDIR /var/www/app

RUN apt-get update && apt-get install -y gitc
RUN git clone $GITHUB_REPO .

RUN apt-get install -y iputils-ping


RUN npm install
RUN npm install -g bower
RUN bower install --allow-root

ADD ./config/default.json config/default.json
#ADD ./initData.js initData.js

EXPOSE 3000

CMD ["sh", "-c", "node initData.js && node ."]