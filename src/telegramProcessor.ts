import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import dotenv from 'dotenv';

dotenv.config();

const token: string = process.env.BOT_TOKEN as string;

//const telegram: Telegram = new Telegram(token);

const bot: Telegraf<Context<Update>> = new Telegraf(token);

const startBot = () => {
    bot.start((ctx) => {
        ctx.reply('Hello ' + ctx.from.first_name + '!');
    });


    bot.launch();
    return bot;
}

const getBot = () => bot;

export {startBot, getBot};