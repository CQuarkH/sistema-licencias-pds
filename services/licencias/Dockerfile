FROM node:18-alpine

# Instalar wait-for-it
RUN apk add --no-cache bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["npm", "start"]
