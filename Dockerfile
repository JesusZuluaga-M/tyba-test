FROM node:24-alpine

WORKDIR /app

COPY . .
RUN npm install && npm run build

CMD ["node", "dist/main"]
