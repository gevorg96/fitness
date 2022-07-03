import {Markup, Telegraf} from "telegraf";
import {SessionContext} from "../sessionContext";
import {email, emailRegex, emailStep, gender, start, threeYearsAgo, thx} from "../constants";
import {UserService} from "../../services/userService";

const userService = new UserService();

export const familiarity = (bot: Telegraf<SessionContext>) => {
    bot.start(async (ctx) => {
        await userService.init(ctx.chat.id)
        await ctx.reply(start(ctx.from.first_name));
        await ctx.replyWithHTML(gender, Markup.inlineKeyboard([
            [Markup.button.callback('Мужчина', 'male'), Markup.button.callback('Женщина', 'female'), ]
        ]))
    });

    bot.action('male', async ctx => {
        await userService.update(ctx.chat.id, {gender: {value: 0}, name: {value: ctx.from.first_name}, login: {value: ctx.from.username}});

        ctx.session.step = emailStep;
        await ctx.answerCbQuery();
        await ctx.replyWithHTML(email)
    })
    bot.action('female', async ctx => {
        await userService.update(ctx.chat.id, {gender: {value: 0}, name: {value: ctx.from.first_name}, login: {value: ctx.from.username}});

        ctx.session.step = emailStep;
        await ctx.answerCbQuery();
        await ctx.replyWithHTML(email)
    })

    bot.email(emailRegex, async ctx => {
        if (ctx.session.step === emailStep) {
            await userService.update(ctx.chat.id, {email: {value: ctx.match.input}});

            ctx.session.step = null
            await ctx.replyWithHTML(thx)
            await ctx.replyWithHTML(threeYearsAgo, Markup.inlineKeyboard([
                [Markup.button.callback('Хм, звучит неплохо', 'not_bad') ]
            ]))
        }
    })
}