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

        ctx.session.step = 'objective'
        await ctx.replyWithHTML("1.	Ваша цель:", getObjectiveMarkup())
    })

    bot.action('objective', ctx => {
        ctx.replyWithHTML('1. Ваша цель:', getObjectiveMarkup())
    })


    bot.action('weight_up', ctx => {
        ctx.session.step = 'weight_up'
        ctx.replyWithHTML('2. Ваш возраст:', getAgeMarkup())
    })
    bot.action('weight_down', ctx => {
        ctx.session.step = 'weight_down'
        ctx.replyWithHTML('2. Ваш возраст:', getAgeMarkup())
    })


    bot.action('young', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'young'
        ctx.replyWithHTML('3. Тип фигуры', getFigureMarkup(prev))
    })
    bot.action('old', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'old'
        ctx.replyWithHTML('3. Тип фигуры', getFigureMarkup(prev))
    })


    bot.action('thin', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'thin'
        ctx.replyWithHTML('4. Ваша дневная активность:', getActivityMarkup(prev))
    })
    bot.action('muscular', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'muscular'
        ctx.replyWithHTML('4. Ваша дневная активность:', getActivityMarkup(prev))
    })
    bot.action('fat', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'fat'
        ctx.replyWithHTML('4. Ваша дневная активность:', getActivityMarkup(prev))
    })


    bot.action('activity_low', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'activity_low'
        ctx.replyWithHTML('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):', getInventoryMarkup(prev))
    })
    bot.action('activity_medium', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'activity_medium'
        ctx.replyWithHTML('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):', getInventoryMarkup(prev))
    })
    bot.action('activity_high', ctx => {
        let prev = ctx.session.step;
        ctx.session.step = 'activity_high'
        ctx.replyWithHTML('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):', getInventoryMarkup(prev))
    })

    bot.action(/inventory_[1-9]/, ctx => {
        let prev = ctx.session.step;
        const selected = ctx.match.input.split('-').pop();
        ctx.replyWithHTML('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):', getInventoryMarkup(prev, +selected))
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

const getObjectiveMarkup = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('Набор мышечной массы', 'weight_up')],
        [Markup.button.callback('Сушка', 'weight_down')]
    ]);
}

const getAgeMarkup = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('18-35', 'young'), Markup.button.callback('35-50', 'old')],
        [Markup.button.callback('Назад', 'objective')],
    ]);
}

const getFigureMarkup = (prev: string) => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('Эктоморф', 'thin')], 
        [Markup.button.callback('Мезоморф', 'muscular')],
        [Markup.button.callback('Эндоморф', 'fat')],
        [Markup.button.callback('Назад', prev)],
    ]);
}

const getActivityMarkup = (prev: string) => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('Низкая', 'activity_low')], 
        [Markup.button.callback('Средняя', 'activity_medium')],
        [Markup.button.callback('Высокая', 'activity_high')],
        [Markup.button.callback('Назад', prev)],
    ]);
}

const getInventoryMarkup = (prev: string, selected: number = -1) => {
    let result = [
        [Markup.button.callback('Штанга', 'inventory_0')], 
        [Markup.button.callback('Гантели', 'inventory_1')],
        [Markup.button.callback('Турник', 'inventory_2')],
        [Markup.button.callback('Отсутствует', 'days')],
        [Markup.button.callback('Далее', 'days')],
        [Markup.button.callback('Назад', prev)],
    ];

    if (selected >= 0 && selected <= 3) {
        if (selected === 1) {
            result[selected] = [Markup.button.callback('Штанга - ✔', 'inventory_0')]
        }
        else if (selected === 2) {
            result[selected] = [Markup.button.callback('Гантели - ✔', 'inventory_1')]
        }
        else if (selected === 2) {
            result[selected] = [Markup.button.callback('Турник - ✔', 'inventory_2')]
        }
    }

    return Markup.inlineKeyboard(result);
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getBot = () => bot;

export {startBot, getBot};