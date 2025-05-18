FROM node:lts-alpine3.20

WORKDIR /app

COPY . .
RUN apk add --no-cache openssl && \
  npm install && \
  npm run build && \
  chmod +x ./tokens.sh && \
  ./tokens.sh && \ 
  npx typeorm migration:run -d src/data-source.ts

CMD ["node", "dist/main"]
