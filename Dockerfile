FROM node:16

# Create app dir
WORKDIR /usr/src/app

# Install dependencies
COPY socket/package*.json .
RUN npm install

# Copy remaining files
COPY socket/ .

# Create front-end dir
WORKDIR /usr/src/app/frontend

# Install front-end dependencies
COPY package*.json .
RUN npm install

# Build front-end
COPY . .
RUN npm run build
RUN cp -r build ..

# Revert working dir
WORKDIR /usr/src/app

# Run socket server
EXPOSE 3030
CMD ["node", "socket.js"]
