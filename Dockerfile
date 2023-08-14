FROM node:20-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /nodejs-homeworks
COPY . .
RUN yarn install --production
CMD ["node", "cross-env NODE_ENV=production node /nodejs-homeworks/server.js"]
