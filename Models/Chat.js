module.exports = class Chat {
    constructor(id='', messages=[]) {
        this.id = id;
        this.messages = messages;
    }

    set chatId(value) {
        this.id = value;
    }

    get chatId() {
        return this.id;
    }

    set chatMessages(value) {
        this.messages = value;
    }

    get chatMessages() {
        return this.messages;
    }
}