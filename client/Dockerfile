FROM node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install
RUN npm install -g typescript http-server

COPY ./ /usr/src/app

RUN npm run build

EXPOSE 443


CMD ["npx", "http-server", "./dist",  "-S", "-C", "certificate.pem", "-p", "443", "--proxy", "https://routrip.prgms-fullcycle.com?"] 
#CMD ["npx", "http-server", "./dist", "-p", "80", "--proxy", "http://routrip.prgms-fullcycle.com?"]