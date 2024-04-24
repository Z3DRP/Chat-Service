const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion} = require('mongodb');
// const uri = process.env.ZON_URI;
const clientDB = require('./clientDB');
// const getClient = () => {
//     return new MongoClient(uri, {
//         serverApi: {
//             version: ServerApiVersion.v1,
//             strict: true,
//             deprecationErrors: true,
//         }
//     });
// }

// create singleton of mongo client
const getClient = () => new clientDB();

const getDBCollection = () => {
    const client = getClient();
    return client.getChatCollection();
}

const insertChat = (client, chat) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chatCollection = getDBCollection();
            const result = await chatCollection.insertOne(chat);

            if (result?.insertedId !== undefined) {
                resolve(`chat ${result.insertedId} created successfully.`);
            } else {
                reject(new Error(`ERROR: insert unexpectedly failed.`));
            }
        } catch(err) {
            reject(err);
        }
    });
}

async function run() {
    // NOTE this works and is how to call code
    const chats = getClient();
    try {

        // await client.connect();

        // await listDatabases(client);
        // const res = await client.db('sample_mflix').collection('comments').insertOne();
        const collection = await chats.getChatCollection();
        const res = await collection.insertOne({name: 'testing new', email: 'nonvalidemail@email.com', text: 'algweahe'});
        console.log(`res ${JSON.stringify(res)}`);

        console.log(`new listing created with id ${res.insertedId}`);

    } catch(e) {
        console.log(`[ERROR] ${e}`);
    }
     finally {
        // await client.close();
        await chats.close();
    }
}

async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();

    console.log('databases');
    databaseList.databases.forEach(db => console.log(` - ${db.name}`));
}

run().catch(console.error);