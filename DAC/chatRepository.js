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

const insertChat = (clnt, chat) => {
    return new Promise(async (resolve, reject) => {
        try {
            await clnt.connect();
            const result = await (clnt.getChatCollection()).insertOne(chat);
            if (result?.insertedId !== undefined) {
                resolve(result);
            } else {
                reject(result);
            }
        } catch (err) {
            reject(new Error(err));
        } finally {
            clnt.close();
        }
    });
}

const updateChat = (clnt, cid, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            await clnt.connect();
            const results = await (clnt.getChatCollection()).updateOne(
                {_id: cid},
                {$push: {messages: message}}
            );
            resolve(result);
        } catch (err) {
            reject(new Error(err));
        } finally {
            clnt.close();
        }
    })
}

const findChatByCid = (clnt, cid) => {
    return new Promise(async (resolve, reject) => {
        try {
            await clnt.connect();
            const result = await (clnt.getChatCollection()).findOne({_id: cid});
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
            const result = await (clnt.getChatCollection()).find({userId: usrId});
            resolve(result);
        } catch(err) {
            reject(new Error(err));
        } finally {
            clnt.close();
        }
    })
}

const createChat = async (chat) => {
    const chatsDB = getClient();
    let response;
    insertChat(chatsDB, chat)
    .then((result) => {
        response = {
            success: result?.insertedId !== undefined,
            insertedId: result?.insertedId ?? undefined,
            message: result?.insertedId === undefined ? `An error occurred while creating chat` : `New chat has been created successfully`
        };
    }).catch(err => {
        throw new Error(err?.errMsg);
    })
    .finally(() => {
        chatsDB.close();
    });

    return response;
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
    })
    .finally(() => {
        chatsDB.close();
    });

    return response;
}

const fetchPreviousChats = async (usrId) => {
    const chatsDB = getClient();
    let response;
    findPreviousChats(chatsDB, usrId)
    .then((result) => {
        response = {
            success: result ? true : false,
            results: [...result],
            message: result ? `Previous chats have been found` : `Could not find previous chats for user ${usrId}`
        }
    }).catch(err => {
        throw new Error(err);
    })
    .finally(() => {
        chatsDB.close();
    });

    return response;
}

const updateMessages = async (cid, message) => {
    const chatsDB = getClient();
    let response;
    updateChat(chatsDB, cid, message)
    .then((result) => {
        response = {
            success: result.matchedCount === result.modifiedCount && result.modifiedCount > 0,
            result: result,
            message: (result.matchedCount === result.modifiedCount && result.modifiedCount > 0) ? 
            `Message added to chat ${cid} successfully` : `Messages could not be added to chat ${cid}`
        }
    })
    .catch(err => {
        throw new Error(err);
    })
    .finally(() => {
        chatsDB.close();
    });

    return response;
}

const tst2 = async () => {
    const chatsDB = new clientDB();
    await chatsDB.client.connect();
    let result = await (chatsDB.getChatCollection()).insertOne({});
    return result;
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

module.exports = {getDatabases, updateMessages, fetchPreviousChats, fetchChatByCid, createChat, testInsert, tst2};