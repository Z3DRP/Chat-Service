import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import winston from 'winston';

class clientDB {
    private static _instance: clientDB;
    private readonly _logger: winston.Logger;
    public client: mongoDB.MongoClient;

    private constructor() {
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
        
        this.client = new mongoDB.MongoClient(process.env.ZON_URI as string, {
            serverApi: {
                version: mongoDB.ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    };

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new clientDB();
        return this._instance;
    }

    public get logger() {
        return this._logger;
    }

    getChatCollection = async () => {
        await this.client.connect();
        // return this.client.db(process.env.DB).collection(process.env.CHAT_COLLECTION as string);
        //testing with smpl_mflx
        return this.client.db('sample_mflix').collection('comments');
    }

}

export default clientDB;