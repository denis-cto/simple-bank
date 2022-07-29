FROM node:13-alpine
RUN mkdir /app
WORKDIR /app

COPY . .

RUN yarn config set strict-ssl false
RUN yarn install --network-timeout 1000000
RUN yarn build
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 3000 3001
USER node
