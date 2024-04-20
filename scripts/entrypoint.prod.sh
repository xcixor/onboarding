#!/bin/sh

echo 'Starting app...'
npx prisma generate
npx prisma migrate deploy
npx prisma db push 
node seed.ts
npm start