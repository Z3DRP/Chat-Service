const ChatFactory = require('./ChatFactory');

module.exports = {
    convertToAppChats(chats) {
        let results = [];
        for (let chat of chats) {
            results.push(ChatFactory.createChat(
                'AppChat',
                {
                    id: chat._id.toString(),
                    dtArg: chat?.creationDate,
                    messages: chat?.messages ?? [],
                    descrp: chat?.description
                }
            ));
        }
        return results;
    },
    convertToChats(chats) {
        let results = [];
        for (let chat of chats) {
            results.push(ChatFactory.createChat(
                'Chat',
                {
                    id: chat?.cId,
                    message: chat?.messages
                }
            ));
        }
        return results;
    }
}