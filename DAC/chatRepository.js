import dotenv from 'dotenv';

dotenv.config();
const { MongoClient, ServerApiVersion} = require('mongodb');
const uri = env.process.ZON_URI;

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
        await client.db("admin").command({ping: 1});
        console.log("pinged mongodb cluster");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);