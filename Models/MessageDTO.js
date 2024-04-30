module.exports = class MessageDTO {
    constuctor({id='', usrId, role, content, date}) {
        this.id = id;
        this.uId = usrId;
        this.creationDate = date,
        this.body = content;
        this.type = role;
    }

    set messageId(value) {
        this.id = value;
    }

    get messageId() {
        return this.id;
    }

    set userId(value) {
        this.uId = value;
    }

    get userId() {
        return this.uId;
    }

    set messageDate(value) {
        this.creationDate = value;
    }

    get messageDate() {
        return this.creationDate;
    }

    set messageType(value) {
        this.type = value;
    }

    get messageType() {
        return this.type;
    }
}