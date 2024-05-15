FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install
RUN npm install -g typescript

COPY ./ /usr/src/app

RUN npm run build

EXPOSE 1234

CMD ["npm", "start"] 
