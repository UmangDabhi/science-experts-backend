# Step 1: Use the official Node.js image as the base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install the backend dependencies
RUN npm install

# Step 5: Copy the entire backend code and the frontend build directory into the container
COPY . .

# Step 6: Build the NestJS application (if required)
RUN npm run build

# Step 7: Serve the React frontend from the public directory
RUN mkdir -p /app/dist/public && cp -r /app/public /app/dist/public

# Step 8: Expose the port that the backend will run on
EXPOSE 3000

# Step 9: Start the NestJS backend (serve static files)
CMD ["npm", "run", "start:prod"]
