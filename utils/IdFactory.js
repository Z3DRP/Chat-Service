module.exports = {
    generateId(type) {
        switch (type.toLowerCase()) {
            case 'message':
                return `MSG-${this.idGenerator()}`;
            case 'chat':
                return `CHT-${this.idGenerator()}`;
            case 'user':
                return`USR-${this.idGenerator()}`;
            case 'assistant':
                return '0xx';
        }
    },

    idGenerator() {
        return `${Math.random().toString(36).slice(2)}`;
    }
}