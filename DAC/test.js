const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion} = require('mongodb');
const uri = process.env.ZON_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();

        await listDatabases(client);

        const res = await client.db('sample_mflix').collection('comments').insertOne();
        console.log(`res ${JSON.stringify(res)}`);

        console.log(`res.result ${res.result}`);
        console.log(`res.result.ok ${res.result.ok}`);
        console.log(`new listing created with id ${res.insertedId}`);

    } catch(e) {
        console.log(`[ERROR] ${e}`);
    }
     finally {
        await client.close();
    }
}

async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();

    console.log('databases');
    databaseList.databases.forEach(db => console.log(` - ${db.name}`));
}

run().catch(console.error);