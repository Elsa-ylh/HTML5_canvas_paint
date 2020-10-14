FROM node:lts-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser"

RUN apk update && \
    apk add --no-cache chromium

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories
RUN apk update
# mongodb installation throws an error, but seems to work, so ignoring the exit status.
RUN apk add mongodb=4.0.5-r0 || true
# this is required by mongodb-memory-server to avoid trying to download the mongod file.
ENV MONGOMS_SYSTEM_BINARY=/usr/bin/mongod