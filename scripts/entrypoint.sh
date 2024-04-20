#!/bin/sh

echo 'Starting app...'
npx prisma generate
npx prisma db push
npm run dev