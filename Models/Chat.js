module.exports = class Chat {
    _id;
    messages = [];
    
    constructor({id='', messages=[]}) {
        this._id = id;
        this.messages = messages;
    }
}