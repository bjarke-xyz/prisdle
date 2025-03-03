FROM docker.io/node:22-alpine

RUN apk add --no-cache make

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

RUN make build