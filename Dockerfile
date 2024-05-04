FROM node:lts
WORKDIR /chat-service
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8000
EXPOSE 8000
CMD ["npm", "start"]
