class Message {
    
    constructor({role, content}) {
        this.role = role;
        this.content = content;
    }

    getMessageRole() {
        return this.role;
    }

    getMessageContent() {
        return this.content;
    }

    setMessageRole(value) {
        this.role = value;
    }

    setMessageContent(value) {
        this.content = value;
    }

    getChatStartMessage() {
        return new Message('system', "You are a helpful property management assistant.");
    }
}