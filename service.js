const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testInsert, getDatabases } = require('./DAC/chatRepository');
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
        let result = await testInsert('sample_mflix', 'users', {
            uid: request.body.id,
            firstName: request.body.firstName,
            lastName: request.body.lastName
        });
        // let results = await testInsert('sample_mflix', 'users', {
        //     uid: '1',
        //     firstName: 'tito',
        //     lastName: 'brown',
        //     email: 'tBrown1@gmail.com',
        //     phone: '181-902-8745'
        // });

        console.log(JSON.stringify(results));

        response.json({
            wasSuccessful: results.success, 
            id: results.insertedId,
            msg: results.msg
        });
    } catch (err) {
        console.Error(err);
        response.status(500).json({error: `Internal Server Error: ${err}`});
    }
});

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
        console.error(`[ERROR] ${err}`);
        response.status(500).json({error: err.Error});
    }
})