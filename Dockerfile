FROM node:20-alpine

LABEL MAINTAINER="dipesh.rijal@gmail.com"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_URI=mongodb://mongodb-mongodb:27017
ENV PORT=3000
ENV JWT_SECRET=helloworld
ENV LOG_LEVEL=info

EXPOSE 3000

CMD ["npm", "start"]
