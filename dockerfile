FROM node:16 

RUN npm install -g nodemon 

WORKDIR /index

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 8008

CMD [ "npm","start" ]

# FROM node:16


# RUN npm install -g nodemon

# WORKDIR /index

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 8008

# CMD [ "npm" ,"start" ]