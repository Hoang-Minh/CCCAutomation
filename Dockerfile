# Specify a base image
FROM node:alpine

# Create work folder and cd in there
WORKDIR /usr/app

# Copy only the package.json to the working directory
COPY ./package.json ./

# Install some dependencies
RUN npm install

# Copy everything else
COPY ./ ./

# Default command
CMD ["npm", "start"]
