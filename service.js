import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import dotenv from 'dontenv';

const PORT = 443;
const service = express();
service.use(cors());
service.use(express.json());
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPAI_KEY
});

service.listen(PORT, () => console.log('Service is running...'));

service.post('/test/chat', async (req, response), next => {
    try {
        
    }
})

service.get('/chat/previous', async (req, res, next) => {
    try {
        

    } catch (err) {
        console.log(`[ERROR] ${err}`);
        res.status(500).json({error: err.Error});
    }
})

service.post('/chat/message', async (req, res, next) => {
    try {
        console.log('processing message');

    } catch (err) {
        console.error(`[ERROR] ${err}`);
        res.status(500).json({error: err.Error});
    }
})