FROM node:carbon

# Create app directory
WORKDIR /usr/src/app


# Install Tools
RUN apt-get update && apt-get install -y net-tools nano

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]