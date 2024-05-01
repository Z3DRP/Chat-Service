
module.exports = class AppChat {
    constructor({id, dtArg, messages=[], descrp}) {
        this.cId = id;
        this.chatDate = dtArg;
        this.messages = messages;
        this.description = descrp;
    }

    set chatId(value) {
        this.cId = value;
    }

    get chatId() {
        return this.cId;
    }

    set creationDate(value) {
        this.chatDate = value;
    }

    get creationDate() {
        return this.chatDate;
    }

    get formattedChatDate() {
        return this.chatDate.toISOString();
    }

    set chatMessages(value) {
        this.messages = value;
    }

    get chatMessages() {
        return this.messages;
    }

    addMessage(value) {
        this.messages.push(value);
    }
}