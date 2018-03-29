FROM hub.c.163.com/library/node

RUN apt-get update \
    && apt-get install -y nginx

ADD . /code 

WORKDIR /code

RUN npm install \
    && npm run build \
    && cp -r dist/* /var/www/html \
    && cp nginx_monitor.conf /etc/nginx/sites-enabled/default

CMD nginx -g "daemon off;"

