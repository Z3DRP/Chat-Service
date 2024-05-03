
module.exports = class AppChat {
    _id;
    userId;
    chatDate;
    messages = [];
    description;

    constructor({id, usrId, dtArg, messages=[], descrp}) {
        this._id = id;
        this.userId = usrId;
        this.chatDate = dtArg;
        this.messages = messages;
        this.description = descrp;
    }
}