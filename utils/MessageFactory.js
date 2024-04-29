const AppMessage = require('./Models/AppMessage');
const Message = require('./Models/Message');
const MessageDTO = require('./Models/MessageDTO');

const msg = {AppMessage, Message, MessageDTO};

module.exports = {
    createMessage(type, attributes) {
        const MsgType = msg[type];
        return new MsgType(attributes);
    }
};