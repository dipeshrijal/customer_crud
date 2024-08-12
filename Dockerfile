FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_URI=mongodb+srv://vertex:vertex@logbook.eyaj0tg.mongodb.net/vertex?appName=vertex
ENV PORT=3000
ENV JWT_SECRET=helloworld
ENV LOG_LEVEL=info

EXPOSE 3000

CMD ["npm", "start"]
