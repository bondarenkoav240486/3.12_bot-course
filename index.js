const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');

// const token = '1702630643:AAHXiY0MRDKeF1XcuGTxWmpgdcCdAgzt4gE'
const token = '7163452457:AAGU8wD4dsOIoUitmy-Gkvm5OWuYQM8NEkY'


const bot = new TelegramApi(token, { polling: true })




const chats = {}




const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Зараз я загадаю цифру від 0 до 9, а ти маєш її вгадати!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Відгадивай', gameOptions);
}

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Подключение к бд +++++ !!!!!')

    } catch (e) {
        console.log('Подключение к бд сломалось', e)
    }

    bot.setMyCommands([
        { command: '/start', description: 'Початкове привітання' },
        { command: '/info', description: 'Отримати информацію про користувача' },
        { command: '/game', description: 'Гра вгадай цифру' },
    ])

    bot.on('message', async msg => {
        console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {

                // await UserModel.create({ chatId })

                // await UserModel.create({ chatId })
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8a2/c53/8a2c53a4-6753-3348-8d3b-cc0cdcc7185a/6.webp')
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8a2/c53/8a2c53a4-6753-3348-8d3b-cc0cdcc7185a/7.webp')
                // await bot.sendSticker(
                //     chatId,
                //     `https://tlgrm.ru/_/stickers/8a2/c53/8a2c53a4-6753-3348-8d3b-cc0cdcc7185a/10.webp`
                // )
                return bot.sendMessage(chatId, `Ласкаво просимо`);
                // bot.sendMessage(chatId, `You write to me ${text}`)
            }
            if (text === '/info') {
                const user = await UserModel.findOne({ chatId })
                // return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`);
                return bot.sendMessage(chatId, `Тебе звуть ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Я тебе не розумію, спробуй ще раз!)');
        } catch (e) {
            console.log(e)
            return bot.sendMessage(chatId, 'Виникла якась помилка!)');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        console.log(data)
        const chatId = msg.message.chat.id;
        await bot.sendMessage(chatId, `Поздоровляю, ${data} ${chatId} `, againOptions);

        if (data === '/again') {
            return startGame(chatId)
        }
        const user = await UserModel.findOne({ chatId })
        if (data == chats[chatId]) {
            user.right += 1;
            await bot.sendMessage(chatId, `Поздоровляю, ти відгадав цифру ${chats[chatId]}`, againOptions);
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `На жаль ти не вгадав, бот загадав цифру ${chats[chatId]}`, againOptions);
        }
        await user.save();
    })
}

start()
