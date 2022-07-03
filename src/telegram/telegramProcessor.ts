import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { start, gender, email, emailRegex, emailStep, thx, threeYearsAgo, notBad, problems, cool, courseInfo, beginCourse, dislike, goOn, paymentSuccess } from './constants';
import { SessionContext } from './sessionContext';
import {timeZoneResolver} from "../utils/timeZoneResolver";
import {initStepInfo, refreshSteps} from "./steps";
import {UserService} from "../services/userService";
import User from "../dal/Models/user";
import {nameof} from "../utils/nameof";
const PostgresSession = require('telegraf-postgres-session');

dotenv.config();

const token: string = process.env.BOT_TOKEN as string;
const bot: Telegraf<SessionContext> = new Telegraf(token);
bot.use((new PostgresSession()).middleware());

const userService = new UserService();

const startBot = () => {
    bot.start(async (ctx) => {
        await userService.init(ctx.chat.id)
        await ctx.reply(start(ctx.from.first_name));
        await ctx.replyWithHTML(gender, Markup.inlineKeyboard([
            [Markup.button.callback('Мужчина', 'male'), Markup.button.callback('Женщина', 'female'), ]
        ]))
    });
    
    bot.action('male', async ctx => {
        await userService.update<number>(ctx.chat.id, nameof<User>("gender"), 0);
        
        ctx.session.step = emailStep;
        await ctx.answerCbQuery();
        await ctx.replyWithHTML(email)
    })
    bot.action('female', async ctx => {
        await userService.update<number>(ctx.chat.id, nameof<User>("gender"), 1);

        ctx.session.step = emailStep;
        await ctx.answerCbQuery();
        await ctx.replyWithHTML(email)
    })

    bot.email(emailRegex, async ctx => {
        if (ctx.session.step === emailStep) {
            await userService.update<string>(ctx.chat.id, nameof<User>("email"), ctx.match.input);

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

        let now = new Date();
        now.setMonth(now.getMonth() + 1)
        await userService.update<Date>(ctx.chat.id, "paidTo", now);

        ctx.session.step = 'objective'
        ctx.session.stepInfo = JSON.stringify(initStepInfo('objective'))
        await ctx.replyWithHTML("1. Ваша цель:", getObjectiveMarkup())
    })

    bot.action('objective', async ctx => {
        ctx.session.step = ctx.match.input;
        ctx.session.stepInfo = JSON.stringify(initStepInfo(ctx.match.input))
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('1. Ваша цель:')
        await ctx.editMessageReplyMarkup(getObjectiveMarkup().reply_markup)
    })
    
    bot.action('weight_up', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo)
        ctx.session.step = ctx.match.input;
        console.log(ctx.session.stepInfo)
        
        await ctx.editMessageText('2. Ваш возраст')
        await ctx.editMessageReplyMarkup(getAgeMarkup(stepInfo.prev).reply_markup)
    })
    bot.action('weight_down', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('2. Ваш возраст')
        await ctx.editMessageReplyMarkup(getAgeMarkup(stepInfo.prev).reply_markup)
    })


    bot.action('young', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('3. Тип фигуры')
        await ctx.editMessageReplyMarkup(getFigureMarkup(stepInfo.prev).reply_markup)
    })
    bot.action('old', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('3. Тип фигуры')
        await ctx.editMessageReplyMarkup(getFigureMarkup(stepInfo.prev).reply_markup)
    })


    bot.action('thin', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('4. Ваша дневная активность:')
        await ctx.editMessageReplyMarkup(getActivityMarkup(stepInfo.prev).reply_markup)
    })
    bot.action('muscular', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('4. Ваша дневная активность:')
        await ctx.editMessageReplyMarkup(getActivityMarkup(stepInfo.prev).reply_markup)
    })
    bot.action('fat', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('4. Ваша дневная активность:')
        await ctx.editMessageReplyMarkup(getActivityMarkup(stepInfo.prev).reply_markup)
    })


    bot.action('activity_low', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        ctx.session.inventories = null;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):')
        await ctx.editMessageReplyMarkup(getInventoryMarkup(stepInfo.prev).reply_markup)
    })
    bot.action('activity_medium', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        ctx.session.inventories = null;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):')
        await ctx.editMessageReplyMarkup(getInventoryMarkup(stepInfo.prev).reply_markup)
    })
    bot.action('activity_high', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        ctx.session.inventories = null;
        console.log(ctx.session.stepInfo)

        await ctx.editMessageText('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):')
        await ctx.editMessageReplyMarkup(getInventoryMarkup(stepInfo.prev).reply_markup)
    })
    
    bot.action(/inventory_[0-9]/, ctx => {
        const step = 'inventory';
        const selected = ctx.match.input.split('_').pop();

        let stepInfo = refreshSteps(ctx.session.stepInfo, step + '_9');
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = step;
        console.log(ctx.session.stepInfo)

        if (ctx.session.inventories !== null) {
            let inventoriesArray = (ctx.session.inventories as string).split("_");

            if (inventoriesArray.indexOf(selected) >= 0) {
                inventoriesArray = inventoriesArray.filter(x => x !== selected)
                if (inventoriesArray && inventoriesArray.length > 0) {
                    ctx.session.inventories = inventoriesArray.join("_")
                } else {
                    ctx.session.inventories = null;
                }
            } else {
                ctx.session.inventories = ctx.session.inventories + "_" + selected;
            }
        } else {
            ctx.session.inventories = selected;
        }
        
        ctx.editMessageReplyMarkup(getInventoryMarkup(stepInfo.prev, ctx.session.inventories).reply_markup)
    })

    bot.action('days', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);

        ctx.session.inventories = null;
        ctx.session.days = null;
        ctx.session.step = ctx.match.input

        await ctx.editMessageText('6. В какие дни недели тебе удобно заниматься спортом:')
        await ctx.editMessageReplyMarkup(getDaysMarkup(stepInfo.prev).reply_markup)
    })
    bot.action(/day_[0-9]/, ctx => {
        const selected = ctx.match.input.split('_').pop();

        let stepInfo = refreshSteps(ctx.session.stepInfo, 'day_9');
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        
        if (ctx.session.days !== null) {            
            let daysArray = (ctx.session.days as string).split("_");            

            if (daysArray.indexOf(selected) >= 0) {
                daysArray = daysArray.filter(x => x !== selected)
                if (daysArray && daysArray.length > 0) {
                    ctx.session.days = daysArray.join("_")
                } else {
                    ctx.session.days = null;
                }
            } else {
                ctx.session.days = ctx.session.days + "_" + selected;
            }
        } else {
            ctx.session.days = selected;
        }
        
        ctx.editMessageReplyMarkup(getDaysMarkup(stepInfo.prev, ctx.session.days).reply_markup)
    })

    bot.action('time', async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);

        ctx.session.days = null
        ctx.session.step = ctx.match.input;

        await ctx.editMessageText('7. Мне еще нужно узнать, во сколько тебе удобно тренироваться и получать информационные материалы? Напиши в формате ЧЧ:ММ (например, 08:30)')
        await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([Markup.button.callback('Назад', stepInfo.prev)]).reply_markup)
    })

    bot.hears(/^([0-9]?[0-9]):[0-9][0-9]$/, async ctx => {
        if (ctx.session.step === 'time') {

            let time = ctx.match.input.split(":");
            let formatException = "Неверно введены _.. Попробуй еще раз";

            if (time.length !== 2) {
                await ctx.reply("Неверный формат времени.. Попробуй еще раз");
                return
            }

            let hours = +(time[0])
            let minutes = +(time[1])
            if (hours < 0 || hours > 23) {
                await ctx.reply(formatException.replace("_", "часы"));
                return
            }
            if (minutes < 0 || minutes > 59) {
                await ctx.reply(formatException.replace("_", "минуты"));
                return
            }

            ctx.session.step = 'location'
            await ctx.replyWithHTML(`..ох, чуть не забыл. В мире же так много часовых поясов.\n🌍 Давай определим твой город, чтобы я случайно тебе ночью не написал. \n✏️ Отправь мне свою геопозицию`,
                Markup.inlineKeyboard([Markup.button.callback('Назад', 'time')]))
        }
    })

    bot.on('location', async ctx => {
        if (ctx.session.step === 'location') {
            let location = ctx.message.location;
            await ctx.reply(`📍 Скачиваю карту... \nТак непривычно без 5G. Может занять несколько секунд.`)
            const timeZone = await timeZoneResolver({latitude: location.latitude, longitude: location.longitude})

            await ctx.reply(`Нашел твой город. Что-то я засмотрелся на фотки в Google Maps — красиво там у вас, много хороших парков 🌳\nОтлично! Я все записал ✏️`)
            await ctx.reply('На этом всё! Теперь я буду тебе присылать уведомления по расписанию :)')
            console.log(timeZone)
            ctx.session.step = ''
        }
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

const getAgeMarkup = (prev: string) => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('18-35', 'young'), Markup.button.callback('35-50', 'old')],
        [Markup.button.callback('Назад', prev)],
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

const getInventoryMarkup = (prev: string, inventories: string = null) => {
    let result = [
        [Markup.button.callback('Штанга', 'inventory_0')], 
        [Markup.button.callback('Гантели', 'inventory_1')],
        [Markup.button.callback('Турник', 'inventory_2')],
        [Markup.button.callback('Отсутствует', 'days')],
        [Markup.button.callback('Назад', prev)],
    ];

    if (inventories && inventories.length > 0) {
        let selected = inventories.split("_");

        for (const el of selected) {
            let inv = +el;
            if (inv >= 0 && inv <= 3) {
                if (inv === 0) {
                    result[inv] = [Markup.button.callback('Штанга - ✔', 'inventory_0')]
                }
                else if (inv === 1) {
                    result[inv] = [Markup.button.callback('Гантели - ✔', 'inventory_1')]
                }
                else if (inv === 2) {
                    result[inv] = [Markup.button.callback('Турник - ✔', 'inventory_2')]
                }
            }
        }

        result.push([Markup.button.callback('Далее', 'days')])
    }

    return Markup.inlineKeyboard(result);
}

const getDaysMarkup = (prev: string, days: string = null) => {
    let result = [
        [Markup.button.callback('Пн', 'day_0')], 
        [Markup.button.callback('Вт', 'day_1')],
        [Markup.button.callback('Ср', 'day_2')],
        [Markup.button.callback('Чт', 'day_3')],
        [Markup.button.callback('Пт', 'day_4')],
        [Markup.button.callback('Сб', 'day_5')],
        [Markup.button.callback('Вс', 'day_6')],
        [Markup.button.callback('Назад', prev)],
    ];

    if (days && days.length > 0) {
        let selected = days.split("_");

        for (const el of selected) {
            let inv = +el;
            if (inv >= 0 && inv <= 6) {
                if (inv === 0) {
                    result[inv] = [Markup.button.callback('Пн - ✔', 'day_0')]
                }
                else if (inv === 1) {
                    result[inv] = [Markup.button.callback('Вт - ✔', 'day_1')]
                }
                else if (inv === 2) {
                    result[inv] = [Markup.button.callback('Ср - ✔', 'day_2')]
                }
                else if (inv === 3) {
                    result[inv] = [Markup.button.callback('Чт - ✔', 'day_3')]
                }
                else if (inv === 4) {
                    result[inv] = [Markup.button.callback('Пт - ✔', 'day_4')]
                }
                else if (inv === 5) {
                    result[inv] = [Markup.button.callback('Сб - ✔', 'day_5')]
                }
                else if (inv === 6) {
                    result[inv] = [Markup.button.callback('Вс - ✔', 'day_6')]
                }
            }
        }

        result.push([Markup.button.callback('Далее', 'time')]);
    }

    return Markup.inlineKeyboard(result);
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getBot = () => bot;

export {startBot, getBot};