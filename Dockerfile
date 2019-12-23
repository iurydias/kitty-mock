FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST 0.0.0.0

ENV SERVER_PORT 6999

ENV MOCKER_PORTS_RANGE 7000-8000

EXPOSE 6999-8000

CMD ["npm", "start"]


