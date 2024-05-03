const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion} = require('mongodb');
// const uri = process.env.ZON_URI;
const clientDB = require('./clientDB');
const { cli } = require('winston/lib/winston/config');
const getClient = () => {
    return new MongoClient(process.env.ZON_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
}

// create singleton of mongo client
// const getClient = () => new clientDB();

const tstMethod = (client, database, collection, document) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            const result = await client.db(database).collection(collection).insertOne(document);
            // const result = await client.testDB(database, collection, document);
            resolve(result);
        } catch (err) {
            reject(new Error(err));
        } finally {
            client.close();
        }
    });
}

const testInsert = async (db, col, doc) => {
    const client = getClient();
    let response;
    await tstMethod(client, db, col, doc)
    .then((result) => {
        response = {
            success: result?.insertedId !== undefined,
            insertedId: result?.insertedId ?? undefined,
            msg: result?.insertedId === undefined ? `An error occurred while inserting document into ${db}` : `document ${result.insertedId} inserted successfully`
        }
    }).catch(err => {
        throw new Error(err);
    })
    .finally(() => {
        client.close();
    });

    return response;
}

const showDatabases = async () => {
    const client = getClient();
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            const dbs = await client.db().admin().listDatabases();
            // const dbs = await client.showDB();
            resolve(dbs);
        } catch(err) {
            reject(new Error(err));
        } finally {
            client.close();
        }
    });

}

const createChat = (clnt, chat) => {
    return new Promise(async (resolve, reject) => {
        try {
            await clnt.connect();
            const result = await clnt.db(process.env.DB).collection(process.env.CHAT_COLLECTION).insertOne(chat);
            if (result?.insertedId !== undefined) {
                resolve(result);
            } else {
                reject(result);
            }
        } catch (err) {
            reject(new Error(err));
        }
    });
}

const updateChat = async (cid, msgs) => {
    try {
        const client = getClient();
        await client.connect();
        const results = await client.db(process.env.DB).collection(process.env.CHAT_COLLECTION).updateOne(
            {_id: cid},
            {$push: {messages: {$each: msgs}}}
        );
        let response = {
            success: results.matchedCount === results.modifiedCount && results.modifiedCount > 0,
            message: (results.matchedCount === results.modifiedCount && results.modifiedCount > 0) ? 
            `Message added to chat ${cid} successfully` : `Messages could not be added to chat ${cid}`
        }
        client.close();
        return response;
    } catch (err) {

    }
}

const findChatByCid = (clnt, cid) => {
    return new Promise(async (resolve, reject) => {
        try {
            await clnt.connect();
            const result = await clnt.db(process.env.DB).collection(process.env.CHAT_COLLECTION).findOne({_id: cid});
            resolve(result);
        } catch(err) {
            reject(new Error(err));
        } finally {
            clnt.close();
        }
    })
}

const findPreviousChats = (clnt, usrId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await clnt.connect();
            let id = parseInt(usrId);
            const cursor = clnt.db(process.env.DB).collection(process.env.CHAT_COLLECTION).find({userId: id}).sort({creationDate: -1});
            const result = await cursor.toArray();
            resolve(result);
        } catch(err) {
            reject(new Error(err));
        } finally {
            clnt.close();
        }
    })
}


const fetchChatByCid = async (cid) => {
    const chatsDB = getClient();
    let response;
    findChatByCid(chatsDB, cid)
    .then((result) => {
        response = {
            success: result ? true : false,
            chat: result,
            message: result ? `Chat successfully found` : `Chat could not be found`
        }
    })
    .catch(err => {
        throw new Error(err);
    });

    return response;
}

const fetchPreviousChats = async (usrId) => {
    const chatsDB = getClient();
    let response;
    await findPreviousChats(chatsDB, usrId)
    .then((result) => {
        response = {
            success: result ? true : false,
            results: [...result],
            message: result ? `Previous chats have been found` : `Could not find previous chats for user ${usrId}`
        }
    }).catch(err => {
        throw new Error(err);
    });

    return response;
}

const tst2 = async () => {
    const chatsDB = getClient();
    await chatsDB.connect();
    let result = await chatsDB.db(process.env.DB).collection(process.env.CHAT_COLLECTION).insertOne({id: 31, name: 'tasdest'});
    chatsDB.close();
    return result;
}

const insertChat = async (chat) => {
    try {
        const client = getClient();
        await client.connect();
        let result = await client.db(process.env.DB).collection(process.env.CHAT_COLLECTION).insertOne(chat);
        let response = {
            success: result?.insertedId !== undefined,
            id: result?.insertedId ?? undefined,
            message: result?.insertedId === undefined ? 'An error occurred while inserting chat' : 'New chat created successfully'
        }
        client.close();
        return response;
    } catch (err) {
        throw new Error(err);
    }
}

const getDatabases = async () => {
    const chatsDB = getClient();
    let response;
    await showDatabases(chatsDB)
    .then((results) => {
        response = results.databases;
    })
    .catch(err => {
        throw new Error(err);
    })
    .finally(() => {
        chatsDB.close()
    });

    return response;
}

module.exports = {getDatabases, insertChat, fetchPreviousChats, fetchChatByCid, updateChat, testInsert, tst2};