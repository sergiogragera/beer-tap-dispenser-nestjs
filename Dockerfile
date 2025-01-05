FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

CMD ["npm", "start"]