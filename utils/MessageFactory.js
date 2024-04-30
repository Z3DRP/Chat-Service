const AppMessage = require('../Models/AppMessage');
const Message = require('../Models/Message.js');
const MessageDTO = require('../Models/MessageDTO.js');
const msg = {AppMessage, Message, MessageDTO};

module.exports = {
    createMessage(type, attributes) {
        const MsgType = msg[type];
        return new MsgType(attributes);
    }
};