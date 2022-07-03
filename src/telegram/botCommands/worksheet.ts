import {Markup, Telegraf} from "telegraf";
import {SessionContext} from "../sessionContext";
import {paymentSuccess} from "../constants";
import {initStepInfo, refreshSteps} from "../steps";
import {UserService} from "../../services/userService";
import {timeZoneResolver} from "../../utils/timeZoneResolver";
import {delay} from "../../utils/delay";
import {CommandBuilder} from "./internal/commandBuilder";

const userService = new UserService();

export const worksheet = (bot: Telegraf<SessionContext>) => {
    bot.action('payment', async ctx => {
        await ctx.replyWithHTML("** Формирую платеж **")
        await delay(1000);
        await ctx.replyWithHTML("** Снимаю деньги **")
        await delay(1000)
        await ctx.replyWithHTML(paymentSuccess)

        let now = new Date();
        now.setMonth(now.getMonth() + 1)
        await userService.update(ctx.chat.id, {paidTo: {value: now}});

        ctx.session.step = 'objective'
        ctx.session.stepInfo = JSON.stringify(initStepInfo('objective'))
        await ctx.replyWithHTML("1. Ваша цель:", new CommandBuilder()
            .add('Набор мышечной массы', 'weight_up')
            .add('Сушка', 'weight_down')
            .build());
    })

    bot.action('objective', async ctx => {
        ctx.session.step = ctx.match.input;
        ctx.session.stepInfo = JSON.stringify(initStepInfo(ctx.match.input))

        await ctx.editMessageText('1. Ваша цель:')
        await ctx.editMessageReplyMarkup(new CommandBuilder()
            .add('Набор мышечной массы', 'weight_up')
            .add('Сушка', 'weight_down')
            .build().reply_markup)
    })
    
    bot.action(/weight_(up|down)/, async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo)
        ctx.session.step = ctx.match.input;

        await ctx.editMessageText('2. Ваш возраст')
        await ctx.editMessageReplyMarkup(new CommandBuilder()
            .bulkAdd([{name: '18-35', callback: 'young'},{ name: '35-50', callback: 'old'}])
            .add('Назад', stepInfo.prev)
            .build().reply_markup);
    })
    
    bot.action(/(young|old)/, async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;

        await ctx.editMessageText('3. Тип фигуры')
        await ctx.editMessageReplyMarkup(new CommandBuilder()
            .add('Эктоморф', 'thin')
            .add('Мезоморф', 'muscular')
            .add('Эндоморф', 'fat')
            .add('Назад', stepInfo.prev)
            .build().reply_markup);
    })
    
    bot.action(/(thin|muscular|fat)/, async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;

        await ctx.editMessageText('4. Ваша дневная активность:')
        await ctx.editMessageReplyMarkup(new CommandBuilder()
            .add('Низкая', 'activity_low')
            .add('Средняя', 'activity_medium')
            .add('Высокая', 'activity_high')
            .add('Назад', stepInfo.prev)
            .build().reply_markup);
    })
    
    bot.action(/activity_(low|medium|high)/, async ctx => {
        let stepInfo = refreshSteps(ctx.session.stepInfo, ctx.match.input);
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = ctx.match.input;
        ctx.session.inventories = null;

        await ctx.editMessageText('5. Наличие или отсутствие спортивного инвентаря (множественный выбор ответов):')
        await ctx.editMessageReplyMarkup(getInventoryMarkup(stepInfo.prev).reply_markup)
    })
    
    bot.action(/inventory_[0-9]/, ctx => {
        const step = 'inventory';
        const selected = ctx.match.input.split('_').pop();
        if (selected === '9') {
            ctx.session.inventories = null;
        }
        
        let stepInfo = refreshSteps(ctx.session.stepInfo, step + '_9');
        ctx.session.stepInfo = JSON.stringify(stepInfo);
        ctx.session.step = step;
        
        if (ctx.session.inventories !== null) {
            let inventoriesArray = (ctx.session.inventories as string).split("_");

            let idx = inventoriesArray.indexOf(selected);
            if (idx >= 0 && idx < 9) {
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
            ctx.session.inventories = selected !== '9' ? selected : null;
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

        ctx.editMessageReplyMarkup(getDaysMarkup('inventory_9', ctx.session.days).reply_markup)
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
}

const getInventoryMarkup = (prev: string, inventories: string = null) => {
    let result = [
        [Markup.button.callback('Штанга', 'inventory_0')],
        [Markup.button.callback('Гантели', 'inventory_1')],
        [Markup.button.callback('Турник', 'inventory_2')]
    ]
    
    if (inventories && inventories.length > 0) {
        let selected = inventories.split("_");

        for (const el of selected) {
            let inv = +el;
            if (inv >= 0 && inv <= 3) {
                result[inv][0].text = result[inv][0].text + ' - ✔'
            }
        }

        result.push([Markup.button.callback('Далее', 'days')])
    }
    
    result.push([Markup.button.callback('Назад', prev)])
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
                result[inv][0].text = result[inv][0].text + ' - ✔'
            }
        }

        result.push([Markup.button.callback('Далее', 'time')]);
    }

    return Markup.inlineKeyboard(result);
}