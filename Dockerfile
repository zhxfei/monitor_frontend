FROM node:6.10.3-slim

RUN apt-get update \
    && apt-get install -y nginx

ADD . /code 

WORKDIR /code

RUN npm install \
    && npm run build \
    && cp -r dist/* /var/www/html

CMD [ "nginx", "-g", "daemon off;" ]

