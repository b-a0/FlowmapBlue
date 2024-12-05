FROM node:16.9.1-alpine

ARG MAPBOX_LIGHT
ARG MAPBOX_DARK
ARG MAPBOX_TOKEN
ENV NEXT_PUBLIC_MapboxMapStyle_Light=$MAPBOX_LIGHT
ENV NEXT_PUBLIC_MapboxMapStyle_Dark=$MAPBOX_DARK
ENV NEXT_PUBLIC_MapboxAccessToken=$MAPBOX_TOKEN

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]