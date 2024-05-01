const Chat = require('../Models/Chat');
const AppChat = require('../Models/AppChat');
const chats = {Chat, AppChat};

module.exports = {
    createChat(type, attributes) {
        const chatType = chats[type];
        return new chatType(attributes);
    }
}