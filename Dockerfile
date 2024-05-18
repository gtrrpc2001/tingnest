#멀티-스테이지 빌드 사용하기
# FROM node:18-alpine AS builder
# RUN mkdir -p /app
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM node:18-alpine
# RUN mkdir -p /app
# WORKDIR /app
# ADD . /app/
# RUN npm install --production
# EXPOSE 9999
# ENTRYPOINT npm run start:prod

# FROM node:18-alpine

# RUN mkdir -p /app
# WORKDIR /app
# COPY package*.json ./
# ADD . /app/
# RUN npm install
# COPY . .
# EXPOSE 9999
# ENTRYPOINT ["npm", "run", "start:prod"]

# FROM node:18-alpine

# RUN mkdir -p /app
# WORKDIR /app
# ADD . /app/
# RUN npm install --production
# EXPOSE 9999
# ENTRYPOINT npm run start:prod

FROM node:18-alpine

# RUN apk update && apk add --no-cache cron
WORKDIR /app
COPY package*.json ./
RUN npm install --production
RUN npm install pm2 -g
# COPY certbot-renew.sh /certbot-renew.sh
# RUN chmod +x /certbot-renew.sh
COPY . .
# COPY entrypoint.sh /entrypoint.sh
EXPOSE 4500
# ENTRYPOINT npm run start:prod
# ENTRYPOINT ["/entrypoint.sh"]
ENTRYPOINT ["pm2-runtime", "ecosystem.config.js"]