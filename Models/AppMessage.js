class AppMessage extends Message {
    constructor ({id='', uid, creationDate, body, type}) {
        super(type, body);
        this.id = id;
        this.userId = uid;
        this.date = creationDate;
    }

    set messageDate(value) {
        this.date = value;
    }

    get messageDate() {
        return this.date;
    }

    get formattedDate() {
        return this.date.toISOString();
    }

    set messageId(value) {
        this.id = value;
    }

    get messageId() {
        return this.id;
    }

    set userId(value) {
        this.userId = value;
    }

    get userId() {
        return this.userId;
    }
}