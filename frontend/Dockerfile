# Use the official Node.js image as a base image
FROM node:18.17.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies

COPY . .

RUN npm install



RUN npx tailwindcss -i ./src/global.css -o ./src/output.css

# Copy the rest of the application code to the working directory


# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]
