FROM node:14

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . . 

CMD ["npm", "run", "deploy"]

