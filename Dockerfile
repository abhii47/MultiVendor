# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "docker"]