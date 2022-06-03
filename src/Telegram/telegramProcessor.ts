import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { start, gender, email, emailRegex, emailStep, 
    thx, threeYearsAgo, notBad, problems, cool } from './constants';
import { SessionContext } from './sessionContext';
const PostgresSession = require('telegraf-postgres-session');

dotenv.config();

const token: string = process.env.BOT_TOKEN as string;
const bot: Telegraf<SessionContext> = new Telegraf(token);

bot.use((new PostgresSession()).middleware());

const startBot = () => {
    bot.start(async (ctx) => {
        await ctx.reply(start(ctx.from.first_name));
        await ctx.replyWithHTML(gender, Markup.inlineKeyboard([
            [Markup.button.callback('Мужчина', 'male'), Markup.button.callback('Женщина', 'female'), ]
        ]))
    });

    bot.action('male', ctx => {
        ctx.session.step = emailStep;
        ctx.answerCbQuery();        
        ctx.replyWithHTML(email)
    })

    bot.email(emailRegex, async ctx => {
        if (ctx.session.step === emailStep) {
            ctx.session.step = null
            await ctx.replyWithHTML(thx)
            await ctx.replyWithHTML(threeYearsAgo, Markup.inlineKeyboard([
                [Markup.button.callback('Хм, звучит неплохо', 'not_bad') ]
            ]))
        }
    })

    bot.action('not_bad', ctx => {
        ctx.replyWithHTML(notBad, Markup.inlineKeyboard([
            [Markup.button.callback(
`Ты такой не один, 
это распространенные проблемы.`, 'problems') ]
        ]))
    })

    bot.action('problems', ctx => {
        ctx.replyWithHTML(problems, Markup.inlineKeyboard([
            [Markup.button.callback('Выглядит круто', 'cool') ]
        ]))
    })

    bot.action('cool', ctx => {
        ctx.replyWithHTML(cool, Markup.inlineKeyboard([
            [Markup.button.callback('Начать курс', 'begin_course')],
            [Markup.button.callback('Расскажи о курсе', 'course_info'), Markup.button.callback('Покажи программу', 'plan_info')],
            [Markup.button.callback('Пример упражнений', 'exercise_example'), Markup.button.callback('Пример статьи', 'article_example')]
        ]))
    })

    bot.launch();
    return bot;
}

const getBot = () => bot;

export {startBot, getBot};