'use strict';

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
require('dotenv').config();

const UrlMessage = require('viber-bot').Message.Url;
const ContactMessage = require('viber-bot').Message.Contact;
const PictureMessage = require('viber-bot').Message.Picture;
const VideoMessage = require('viber-bot').Message.Video;
const LocationMessage = require('viber-bot').Message.Location;
const StickerMessage = require('viber-bot').Message.Sticker;
const FileMessage = require('viber-bot').Message.File;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const KeyboardMessage = require('viber-bot').Message.Keyboard;

const winston = require('winston');
const toYAML = require('winston-console-formatter');
const ngrok = require('./get_public_url');

var request = require('request');

const express = require('express')
const app = express()

function createLogger() {
    const logger = new winston.Logger({
        level: "debug" // We recommend using the debug level for development
    });

    logger.add(winston.transports.Console, toYAML.config());
    return logger;
}

function say(response, message) {
    response.send(new TextMessage(message));
}

// function checkUrlAvailability(botResponse, urlToCheck) {

//     if (urlToCheck === '') {
//         say(botResponse, 'I need a URL to check');
//         return;
//     }

//     say(botResponse, 'One second...Let me check!');

//     var url = urlToCheck.replace(/^http:\/\//, '');
//     request('http://isup.me/' + url, function(error, requestResponse, body) {
//         if (error || requestResponse.statusCode !== 200) {
//             say(botResponse, 'Something is wrong with isup.me.');
//             return;
//         }

//         if (!error && requestResponse.statusCode === 200) {
//             if (body.search('is up') !== -1) {
//                 say(botResponse, 'Hooray! ' + urlToCheck + '. looks good to me.');
//             } else if (body.search('Huh') !== -1) {
//                 say(botResponse, 'Hmmmmm ' + urlToCheck + '. does not look like a website to me. Typo? please follow the format `test.com`');
//             } else if (body.search('down from here') !== -1) {
//                 say(botResponse, 'Oh no! ' + urlToCheck + '. is broken.');
//             } else {
//                 say(botResponse, 'Snap...Something is wrong with isup.me.');
//             }
//         }
//     })
// }

function checkUrlAvailability(botResponse, text_received) {
    let sender_name = botResponse.userProfile.name;
    let sender_id = botResponse.userProfile.id;


    if (text_received === '') {
        say(botResponse, 'I need a Text to check');
        return;
    }

    // say(botResponse, 'One second...Let me check!');
    // setTimeout(function() {
    //     say(botResponse, 'Here comes the answer :P!');
    // }, 1000);

    let message;
    if(text_received === 'hi') {
        message = new TextMessage(`hello ${sender_name}`);
    }
    else if(text_received === 'url') {
        let url = "https://xceltrip.com.np"
        message = new UrlMessage(url);
    }
    else if(text_received === 'contact') {
        let contactName = "number";
        let contactPhoneNumber = "9860050468";
        message = new ContactMessage(contactName, contactPhoneNumber);
    }
    else if(text_received === 'picture') {
        // Picture Message object
        let url = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
        message = new PictureMessage(url);
    }
    else if(text_received === 'video') {
        let url = "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4";
        let size = 1;
        message = new VideoMessage(url, size);
    }
    else if(text_received === 'location') {
        let latitude = '16.7985897';
        let longitude = '96.1473162';
        message = new LocationMessage(latitude, longitude);
    }
    else if(text_received === 'sticker') {
        let stickerId = '40133';
        message = new StickerMessage(stickerId);
    }
    else if(text_received === 'file') {
        let url = 'https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf';
        let sizeInBytes = '102400';
        let filename = 'FileMessageTest.pdf';
        message = new FileMessage(url, sizeInBytes, filename);
    }
    else if(text_received === 'rich_media') {
        // ================================
        // RichMedia Message object
        // ================================
        const SAMPLE_RICH_MEDIA = {
            "ButtonsGroupColumns": 6,
            "ButtonsGroupRows": 5,
            "BgColor": "#FFFFFF",
            "Buttons": [{
                "ActionBody": "https://www.google.com",
                "ActionType": "open-url",
                "BgMediaType": "picture",
                "Image": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                "BgColor": "#000000",
                "TextOpacity": 60,
                "Rows": 4,
                "Columns": 6
            }, {
                "ActionBody": "https://www.facebook.com",
                "ActionType": "open-url",
                "BgColor": "#85bb65",
                "Text": "Buy",
                "TextOpacity": 60,
                "Rows": 1,
                "Columns": 6
            }]
        };
        message = new RichMediaMessage(SAMPLE_RICH_MEDIA);
    }
    else if(text_received === 'keyboard') {
        // ================================
        // Keyboard Message object
        // ================================
        const SAMPLE_KEYBOARD = {
            "Type": "keyboard",
            "Revision": 1,
            "Buttons": [
                {
                    "Columns": 3,
                    "Rows": 2,
                    "BgColor": "#e6f5ff",
                    "BgMedia": "http://www.jqueryscript.net/images/Simplest-Responsive-jQuery-Image-Lightbox-Plugin-simple-lightbox.jpg",
                    "BgMediaType": "picture",
                    "BgLoop": true,
                    "ActionType": "reply",
                    "ActionBody": "Yes"
                }
            ]
        };
        message = new KeyboardMessage(SAMPLE_KEYBOARD);
    }
    else {
        message = new TextMessage("Hi!" + sender_name + " I didnot understand your message");
    }

    console.log(message);
    botResponse.send(message);
}
const logger = createLogger();

if (!process.env.VIBER_PUBLIC_ACCOUNT_ACCESS_TOKEN_KEY) {
    logger.debug('Could not find the Viber account access token key in your environment variable. Please make sure you followed readme guide.');
    return;
}

// Creating the bot with access token, name and avatar
const bot = new ViberBot(logger, {
    authToken: process.env.VIBER_PUBLIC_ACCOUNT_ACCESS_TOKEN_KEY, // Learn how to get your access token at developers.viber.com
    // name: "Is It Up",
    // avatar: "https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png" // Just a placeholder avatar to display the user
    name: "Viber Bot",
	avatar: "https://developers.viber.com/docs/img/stickers/40122.png" // It is recommended to be 720x720, and no more than 100kb.
});

// The user will get those messages on first registration
bot.onSubscribe(response => {
    say(response, `Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me if a web site is down for everyone or just you. Just send me a name of a website and I'll do the rest!`);
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    // This sample bot can answer only text messages, let's make sure the user is aware of that.
    if (!(message instanceof TextMessage)) {
        say(response, `Sorry. I can only understand text messages.`);
    }
});

bot.onTextMessage(/./, (message, response) => {
    checkUrlAvailability(response, message.text);
});

bot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));


if (process.env.NOW_URL || process.env.HEROKU_URL) {
    const http = require('http');
    const port = process.env.PORT || 8080;

    http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
    logger.debug('Could not find the now.sh/Heroku environment variables. Trying to use the local ngrok server.');
    return ngrok.getPublicUrl().then(publicUrl => {
        const http = require('http');
        const port = process.env.PORT || 5000;

        console.log('publicUrl => ', publicUrl);

        http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(publicUrl));

    }).catch(error => {
        console.log('Can not connect to ngrok server. Is it running?');
        console.error(error);
        process.exit(1);
    });

}