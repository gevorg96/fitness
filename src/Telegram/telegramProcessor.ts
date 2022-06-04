import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { start, gender, email, emailRegex, emailStep, 
    thx, threeYearsAgo, notBad, problems, cool, courseInfo, beginCourse, dislike, goOn, paymentSuccess } from './constants';
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
            [Markup.button.callback(`Ты такой не один, это распространенные проблемы.`, 'problems') ]
        ]))
    })

    bot.action('problems', ctx => {
        ctx.replyWithHTML(problems, Markup.inlineKeyboard([
            [Markup.button.callback('Выглядит круто', 'cool') ]
        ]))
    })

    bot.action('cool', ctx => {
        ctx.replyWithHTML(cool, getMainKeyboard())
    })

    bot.action('course_info', ctx => {
        ctx.replyWithHTML(courseInfo, getMainKeyboard())
    });

    bot.action('plan_info', ctx => {
        ctx.replyWithHTML('*** Картинка с программой ***', getMainKeyboard())
    })

    bot.action('exercise_example', ctx => {
        ctx.replyWithHTML('*** Упражнения ***', getMainKeyboard())
    })

    bot.action('article_example', ctx => {
        ctx.replyWithHTML('*** Статья ***', getMainKeyboard())
    })

    bot.action('begin_course', ctx => {
        ctx.replyWithHTML(beginCourse, getCourseKeyBoard())
    })

    bot.action('reviews', ctx => {
        ctx.replyWithHTML("*** Картинки с отзывами ***", getCourseKeyBoard())
    })

    bot.action('dislike', ctx => {
        ctx.replyWithHTML(dislike, getCourseKeyBoard())
    })

    bot.action('go_on', ctx => {
        ctx.replyWithHTML(goOn, Markup.inlineKeyboard([
            [Markup.button.callback('Оплатить', 'payment')],
        ]))
    })

    bot.action('payment', async ctx => {
        await ctx.replyWithHTML("** Формирую платеж **")
        await delay(1000);
        await ctx.replyWithHTML("** Снимаю деньги **")
        await delay(1000)
        await ctx.replyWithHTML(paymentSuccess)
    })

    bot.launch();
    return bot;
}

const getMainKeyboard = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('Начать курс', 'begin_course')],
        [Markup.button.callback('Расскажи о курсе', 'course_info'), Markup.button.callback('Покажи программу', 'plan_info')],
        [Markup.button.callback('Пример упражнений', 'exercise_example'), Markup.button.callback('Пример статьи', 'article_example')]
    ]);
}

const getCourseKeyBoard = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('Погнали!', 'go_on')],
        [Markup.button.callback('А если не понравится?', 'dislike'), Markup.button.callback('Есть отзывы?', 'reviews')],
    ]);
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


const getBot = () => bot;

export {startBot, getBot};