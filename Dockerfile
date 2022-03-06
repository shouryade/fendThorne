FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# build app for production with minification
RUN npm run build

EXPOSE 3000
CMD [ "http-server", "dist" ]