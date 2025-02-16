# Use Node.js official image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the app
CMD ["node", "src/index.js"]
