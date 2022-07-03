import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { SessionContext } from './sessionContext';
import {familiarity} from "./botCommands/familiarity";
import {presentation} from "./botCommands/presentation";
import {worksheet} from "./botCommands/worksheet";
const PostgresSession = require('telegraf-postgres-session');

dotenv.config();

const token: string = process.env.BOT_TOKEN as string;
const bot: Telegraf<SessionContext> = new Telegraf(token);
bot.use((new PostgresSession()).middleware());


const startBot = () => {
    familiarity(bot);
    presentation(bot);
    worksheet(bot);
    
    bot.launch();
    return bot;
}

export {startBot};