FROM node:13-alpine
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}

ENV MS_CFG_NAMESPACE=${MS_CFG_NAMESPACE}
ENV MS_CFG_NODEID=${MS_CFG_NODEID}
ENV MS_CFG_LOGGER=${MS_CFG_LOGGER}
ENV MS_CFG_LOGLEVEL=${MS_CFG_LOGLEVEL}
ENV MS_CFG_LOGFORMATTER=${MS_CFG_LOGFORMATTER}
ENV MS_CFG_TRANSPORTER=${MS_CFG_TRANSPORTER}
ENV MS_CFG_SERIALIZER=${MS_CFG_SERIALIZER}
ENV MS_CFG_REQUESTTIMEOUT=${MS_CFG_REQUESTTIMEOUT}
ENV MS_CFG_ENABLED=${MS_CFG_ENABLED}
ENV MS_CFG_RETRIES=${MS_CFG_RETRIES}
ENV MS_CFG_DELAY=${MS_CFG_DELAY}
ENV MS_CFG_MAXDELAY=${MS_CFG_MAXDELAY}
ENV MS_CFG_FACTOR=${MS_CFG_FACTOR}
ENV MS_CFG_MAXCALLLEVEL=${MS_CFG_MAXCALLLEVEL}
ENV MS_CFG_HEARTBEATINTERVAL=${MS_CFG_HEARTBEATINTERVAL}
ENV MS_CFG_HEARTBEATTIMEOUT=${MS_CFG_HEARTBEATTIMEOUT}
ENV MS_CFG_ENABLED=${MS_CFG_ENABLED}
ENV MS_CFG_SHUTDOWNTIMEOUT=${MS_CFG_SHUTDOWNTIMEOUT}
ENV MS_CFG_ENABLED=${MS_CFG_ENABLED}
ENV MS_CFG_CONCURRENCY=${MS_CFG_CONCURRENCY}
ENV MS_CFG_MAXQUEUESIZE=${MS_CFG_MAXQUEUESIZE}
ENV MS_CFG_METRICS=${MS_CFG_METRICS}

RUN mkdir /app
WORKDIR /app

#RUN apk add python alpine-sdk

COPY . .

RUN yarn config set strict-ssl false
RUN yarn global add typescript
RUN yarn
RUN yarn build

EXPOSE 3000 3001

CMD ["yarn", "start:prod"]
