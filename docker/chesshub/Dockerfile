FROM --platform=linux/amd64 node:18.12.0
FROM elasticsearch:7.6.
ENV GITHUB_REPO=https://github.com/kantamat-1024/game-ws.git
USER root
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/data
USER elasticsearch
RUN mkdir -p /var/www/app
WORKDIR /var/www/app
RUN apt-get install -y git
RUN git clone $GITHUB_REPO .
RUN npm install
ADD ./config/default.json config/default.json
ADD ./initData.js initData.js
EXPOSE 3000
CMD node initData.js && node .