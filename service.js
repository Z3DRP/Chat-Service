const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();
const { testInsert, getDatabases, tst2, fetchChatByCid, fetchPreviousChats, updateMessages, insertChat } = require('./DAC/chatRepository');
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
const IdFactory = require('./utils/IdFactory');
const ChatFactory = require('./utils/ChatFactory');
service.use(cors({credentials: true}));
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

const setCookie = (key, value, res) => {
    res.cookie(key, value, {expire: 120 * 60 * 1000, HttpOnly: true, secure: true});
}

const getCookie = (key, res) => res.cookie(key);

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
        const chatId = request.body.chatId;
        let isPrevChat = request.body.isPrevChat;
        let chat;

        if (!isPrevChat) {
            let msg = {...request?.body?.message?.body.split(' ')};
            let msgLength = Object.keys(msg).length;
            let descriptionLimit = msgLength >= 7 ? 7 : 3;
            let msgDescription = '';
            for (let key of Object.keys(msg)) {
                if (key < descriptionLimit) {
                    msgDescription += ` ${msg[key]}`;
                } else {
                    break;
                }
            }
            chat = ChatFactory.createChat('AppChat', {
                id: chatId,
                usrId: request?.body?.message?.uId,
                dtArg: new Date(),
                message: [],
                descrp: `${msgDescription.trim()}...`
            });
            chat.messages.push(messageFactory.createMessage('Message', utils.getSystemMessage()));
        } else {
            let chatCookie = getCookie(`current-${chatId}`, response);

            if (chatCookie === undefined) {
                let results = fetchChatByCid(chatId);
                chat = results.success ? results.chat : new Chat(chatId, messageFactory.createMessage('Message', utils.getSystemMessage()));
            }
        }

        let usrMsgDTO = messageFactory.createMessage('MessageDTO', {
            id: request?.body?.message?._id,
            uId: request?.body?.message?.uId,
            type: request?.body?.message?.type,
            creationDate: request?.body?.message?.creationDate,
            body: request?.body?.message?.body,
        });

        let usrMsg = messageFactory.createMessage('Message', {
            role: usrMsgDTO?.type,
            content: usrMsgDTO?.body
        });
        
        chat?.messages.push(usrMsg);
        // get chat out of session
        // const result = await openai.chat.completions.create({
        //     messages: chat.messages,
        //     model: 'gpt-3.5-turbo',
        //     max_tokens: 75
        // });
        // console.log(result.choices[0]);

        let result = {
            choices: [
                {
                    message: {
                        role: 'assistant',
                        content: 'Certainly! Here is a short eviction notice for Tito Walls:\n\nDear Tito Walls, Please be advised that you are being evicted from the property located at [property address] due to [reason for eviction]. You are required to vacate the premises by [date]. Failure to do so will result in further legal action. Sincerely, [Your Name/Property Manager'
                    }
                }
            ]
        };

        if (result === undefined || result?.choices === undefined) {
            throw new Error('An unexpected error occurred while getting chatbot response.');
        }

        let msgResponse = messageFactory.createMessage('MessageDTO', {
            id: IdFactory.generateId('message'),
            uId: IdFactory.generateId('assistant'),
            type: result?.choices[0]?.message?.role,
            creationDate: new Date(),
            body: result.choices[0]?.message?.content,
        });

        let results = isPrevChat ? await updateMessages(chatId, [usrMsg, msgResponse]) : await insertChat(ChatFactory.createChat('AppChat', {
            id: chat._id,
            usrId: chat.userId,
            dtArg: chat.chatDate,
            messages: [chat.messages[0], usrMsgDTO, msgResponse],
            descrp: chat.description
        }));

        chat?.messages.push(messageFactory.createMessage('Message', {
            role: msgResponse?.type,
            content: msgResponse?.body
        }));

        setCookie(`current-${chatId}`, chat, response);
        console.log(response.cookies());
        console.log(response.cookie(`current-${chatId}`));
        response.json({
            success: results?.success,
            message: results?.message,
            chatCompletion: msgResponse
        });

    } catch (err) {
        console.log(`[ERROR] ${err}`);
        response.status(500).json({error: err.Error});
    }
})