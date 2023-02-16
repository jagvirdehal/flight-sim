FROM node:16

# Create app dir
WORKDIR /usr/src/app

# Install dependencies
COPY socket/package*.json ./
RUN npm install

# Copy remaining files
COPY socket/ .

# Copy front-end build
COPY build/ build/

# Run socket server
EXPOSE 3030
CMD ["node", "socket.js"]
