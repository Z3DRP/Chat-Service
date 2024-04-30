FROM node:lts
WORKDIR /chat-service
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=443
EXPOSE 443
CMD ["npm", "start"]
