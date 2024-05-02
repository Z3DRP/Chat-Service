module.exports = class MessageDTO {    
    constructor({id='', uId, type, body, creationDate}) {
        this._id = id;
        this.uId = uId;
        this.creationDate = creationDate,
        this.body = body;
        this.type = type;
    }
}