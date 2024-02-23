FROM node:latest

USER root

WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm","start" ]