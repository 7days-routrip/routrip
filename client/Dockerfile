FROM node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install
RUN npm install -g typescript http-server

COPY ./ /usr/src/app

RUN npm run build

EXPOSE 80

CMD ["npx", "http-server", "./dist", "-p", "80"] 
