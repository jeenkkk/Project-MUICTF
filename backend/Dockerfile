FROM node

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "start"]