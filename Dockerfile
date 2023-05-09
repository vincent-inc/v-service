FROM nginx:stable-alpine3.17-slim
COPY dist/v-service /usr/share/nginx/html
COPY ngnix-angular.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 81
EXPOSE 82
EXPOSE 83