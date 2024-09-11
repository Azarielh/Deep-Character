FROM node:alpine

COPY ./ /bot

WORKDIR "/bot"

CMD npm i && npm start