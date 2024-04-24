const MongoClient = require('mongodb').MongoClient;
const { ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const winston = require('winston');

class clientDB {
    constructor() {
        if (!clientDB._instance) {
            dotenv.config();

            this._logger = winston.createLogger({
                level: 'info',
                format: winston.format.json(),
                defaultMeta: {service: 'chat-db'},
                transports: [
                    new winston.transports.File({filename: 'error.logs', level: 'error'}),
                    new winston.transports.File({filename: 'info.logs'}),
                ],
            });
    
            if (process.env.NODE_ENV !== 'production') {
                this._logger.add(new winston.transports.Console({
                    format: winston.format.simple(),
                }));
            }

            this.client = new MongoClient(process.env.ZON_URI, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });

            clientDB._instance = this;
        }

        return clientDB._instance;
    }

    async getChatCollection() {
        await this.client.connect();
        // return this.client.db(process.env.DB).collection(process.env.CHAT_COLLECTION as string);
        //testing with smpl_mflx
        return this.client.db('sample_mflix').collection('comments');
    }

    async getUserCollection() {
        await this.client.connect();
        return this.client.db(process.env.DB).collection(USER_COLLECTION);
    }

    async close() {
        await this.client.close();
    }

    get logger() {
        return this._logger;
    }
}

clientDB._instance = null;

module.exports = clientDB;