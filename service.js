const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testInsert, getDatabases, tst2 } = require('./DAC/chatRepository');
const { default: OpenAI } = require('openai');
const PORT = 443;
const service = express();
service.use(cors());
service.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPAI_KEY
});

service.listen(PORT, () => console.log('Service is running...'));

service.get('/test/db', async (request, response) => {
    try {
        console.log('showing databases....');
        let results = await getDatabases();
        response.json({databases: results});
    } catch(err) {
        response.status(500).json({error: err});
    }
});

service.post('/test/db', async (request, response) => {
    try {
        console.log('testing db...');
        let result = await testInsert(process.env.MFLIX_DB, process.env.USER_COLLECTION, {
            uid: request.body.id,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email
        });


        console.log(JSON.stringify(result));

        response.json({
            wasSuccessful: result.success, 
            id: result.insertedId,
            msg: result.msg
        });
    } catch (err) {
        console.log(err);
        response.status(500).json({error: `Internal Server Error: ${err}`});
    }
});

service.get('/t/d', async (request, response) => {
    try {
        let reslt = await tst2();
        response.json({result: reslt});
    } catch (err) {
        response.status(500).json({error: err});
    }
})

service.get('/chat/previous', async (req, res) => {
    // try {
        

    // } catch (err) {
    //     console.log(`[ERROR] ${err}`);
    //     res.status(500).json({error: err.Error});
    // }
})

service.post('/chat/message', async (request, response) => {
    try {
        console.log('processing message');

    } catch (err) {
        console.log(`[ERROR] ${err}`);
        response.status(500).json({error: err.Error});
    }
})