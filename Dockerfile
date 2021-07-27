FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3500
CMD [ "node", "app.js" ]
