const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();
const { testInsert, getDatabases, tst2, fetchChatByCid, fetchPreviousChats, updateMessages } = require('./DAC/chatRepository');
const { default: OpenAI } = require('openai');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const messageFactory = require('./utils/MessageFactory');
const ChatAdapter = require('./utils/ChatAdapter');
const utils = require('./utils/utilities');
const Chat = require('./Models/Chat');
const service = express();
const cookieParser = require('cookie-parser');
const { http } = require('winston');
service.use(cors());
service.use(express.json());
service.use(cookieParser());
service.use(helmet());


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 25
});
service.use(limiter);

// TODO setup JWT and store userid in sub field, then unencode token and retrieve id

const openai = new OpenAI({
    apiKey: process.env.OPAI_KEY
});

const setCookie = (key, value, request) => {
    request.cookie(key, value, {expire: 120 * 60 * 1000, HttpOnly: true, secure: true});
}

const getCookie = (key, request) => request.cookie(key);

service.listen(process.env.PORT, () => console.log('Service is running...'));

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

service.get('/chat/previous', async (request, response) => {
    try {
        let usrId = request.query.uid;
        let result = await fetchPreviousChats(usrId);
        response.json({
            chats: [...ChatAdapter.convertToAppChats(result.results)],
            message: result.message,
            success: result.success
        });

    } catch (err) {
        console.log(`[ERROR] ${err}`);
        res.status(500).json({error: err.Error});
    }
})

service.post('/chat/message', async (request, response) => {
    try {
        const chatId = request.query.chatId;
        let isPrevChat = request.body.isPrevChat;
        let chat;

        if (!isPrevChat) {
            chat = new Chat(chatId, []);
            chat.messages.push(messageFactory.createMessage('Message', utils.getSystemMessage()));
        } else {
            let chatCookie = getCookie(`current-${chatId}`, request);

            if (chatCookie === undefined) {
                let results = fetchChatByCid(chatId);
                chat = results.success ? results.chat : new Chat(chatId, messageFactory.createMessage('Message', utils.getSystemMessage()));
            }
        }

        let usrMsg = messageFactory.createMessage('AppMessage', {
            id: request.body.id,
            uid: request.body.uId,
            creeationDate: request.body.creationDate,
            body: request.body.body,
            type: request.body.type
        });

        chat.messages.push(usrMsg);
        // get chat out of session
        const msgResponse = await openai.chat.completions.create({
            messages: chat.messages,
            model: 'gpt-3.5-turbo',
            max_tokens: 75
        });

        console.log(msgResponse.choices[0]);

        let updateResults = updateMessages(chatId, [usrMsg, msgResponse]);

        if (!updateResults.success) {
            throw new Error(`An error occurred while updating chat:: ${updateResults.message}`);
        }

        setCookie(`current-${chatId}`, chat, request);
        response.json({
            success: updateResults.success,
            message: updateResults.message,
            chatCompletion: msgResponse
        });

    } catch (err) {
        console.log(`[ERROR] ${err}`);
        response.status(500).json({error: err.Error});
    }
})