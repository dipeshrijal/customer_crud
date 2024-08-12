# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


ENV MONGO_URI=mongodb+srv://vertex:vertex@logbook.eyaj0tg.mongodb.net/vertex?appName=vertex
ENV PORT=3000
ENV JWT_SECRET=helloworld
ENV LOG_LEVEL=info

# Expose the port the app runs on
EXPOSE 3000

# Define the command to start the application
CMD ["npm", "start"]
