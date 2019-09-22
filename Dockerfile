FROM node:8-slim
LABEL maintainer="efg.river@gmail.com"
ENV SRC_DIR /usr/local/opt/ego-search
RUN mkdir -p $SRC_DIR
WORKDIR ${SRC_DIR}
ADD . ${SRC_DIR}
RUN yarn install
RUN yarn build
CMD yarn run start