FROM node:20-alpine
# Install a real static server globally
RUN npm install -g serve
WORKDIR /app
COPY . .
# Serve the current directory on port 3000
CMD ["serve", "-p", "3000", "."]
