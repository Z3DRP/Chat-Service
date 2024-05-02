const Message = require('./Message');
module.exports = class AppMessage {
    constructor ({id='', uid, creationDate, body, type}) {
        this._id = id;
        this.userId = uid;
        this.date = creationDate;
        this.body = body;
        this.type = type;
    }
}
