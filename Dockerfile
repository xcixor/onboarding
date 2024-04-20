FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000
FROM base as dev
ENV NODE_ENV=development
RUN npm install 
COPY . .
# RUN npx prisma generate
# RUN npx prisma db push
# CMD npm run dev

# copy entrypoint-prod.sh
RUN chmod u+x /app/scripts/entrypoint.sh
ENTRYPOINT ["/app/scripts/entrypoint.sh"]
