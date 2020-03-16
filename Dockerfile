# Inspired by https://www.freecodecamp.org/news/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70/

# base image
FROM node:13.8 as build

# set working directory
WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock    /app/yarn.lock

# install dependencies
RUN yarn

# install app
COPY . /app/

# prepare for ~production~
RUN yarn build

# production environment
FROM nginx:1.16-alpine
COPY --from=build /app/build /usr/share/nginx/html/

# Add dependencies.
RUN apk add --no-cache bash

# Trash and recreate `nginx` configuration.
RUN rm -rf /etc/nginx/conf.d
COPY nginx.conf.d /etc/nginx/conf.d

# open TCP port for `nginx`.
EXPOSE 80

# Prepare environment.
WORKDIR /usr/share/nginx/html
COPY ./reactenv.bash .
COPY .env .
RUN chmod +x reactenv.bash

# Parse environment variables and start webserver.
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/reactenv.bash && nginx -g \"daemon off;\""]
