FROM node:18-alpine AS base
LABEL maintainer="Onbloc Jinoo <jwchoi@onbloc.xyz>"
LABEL description="gnoswap-interface server with nextjs"

WORKDIR /usr/app
COPY . .

FROM base AS build
COPY . .
RUN yarn
RUN yarn workspace @gnoswap-labs/web build

FROM base AS release
COPY --from=build /usr/app/packages/web/.next ./packages/web/.next
COPY --from=build /usr/app/packages/web/public ./packages/web/public
RUN rm -rf /usr/app/packages/web/.next/cache

EXPOSE 3000
CMD [ "yarn" , "workspace", "@gnoswap-labs/web", "start"]