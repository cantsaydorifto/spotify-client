FROM node:22-alpine AS builder
WORKDIR /app

ARG BASE_URL
ARG CLIENT_ID
ARG SAAVN_API_URL
ARG BASE_SPOTIFY_API_URL

ENV BASE_URL=$BASE_URL
ENV CLIENT_ID=$CLIENT_ID
ENV SAAVN_API_URL=$SAAVN_API_URL
ENV BASE_SPOTIFY_API_URL=$BASE_SPOTIFY_API_URL


COPY package*.json ./
RUN npm ci


COPY . .

RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]