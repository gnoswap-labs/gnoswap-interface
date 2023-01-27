FROM node:18-alpine AS base
LABEL maintainer="Onbloc Jinoo <jwchoi@onbloc.xyz>"
LABEL description="gnoswap-interface server with nextjs"

WORKDIR /usr/app

COPY ./package*.json .
COPY ./yarn* .
COPY ./env* .

FROM base AS build
COPY . .
RUN npm install
RUN npm run build

FROM base AS release
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/.next ./.next
COPY --from=build /usr/app/public ./public

EXPOSE 3000
CMD [ "npm" , "run" , "start"]