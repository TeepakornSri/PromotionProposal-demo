FROM node:20.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --base=/PromotionProposal/dist/

RUN npm install express

COPY server.js .

EXPOSE 8004

CMD ["node", "server.js"]
