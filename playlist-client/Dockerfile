# FROM node:12
# WORKDIR /app
# COPY . /app
# RUN npm install
# ENTRYPOINT ["npm", "run", "start"]
FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "start"]