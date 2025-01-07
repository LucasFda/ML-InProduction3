# backend/Dockerfile

# Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build argument for API URL
ARG MONGO_URL

# Set environment variable for build
ENV MONGO_URL $MONGO_URL

# Expose the backend port
EXPOSE 3001

# Start the backend service
CMD ["npm", "start"]
