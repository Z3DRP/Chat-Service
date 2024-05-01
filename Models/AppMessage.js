const Message = require('./Message');
module.exports = class AppMessage extends Message {
    constructor ({id='', uid, creationDate, body, type}) {
        super(type, body);
        this.id = id;
        this.userId = uid;
        this.date = creationDate;
    }
}
