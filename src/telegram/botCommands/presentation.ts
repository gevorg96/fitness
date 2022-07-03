import {Markup, Telegraf} from "telegraf";
import {SessionContext} from "../sessionContext";
import {beginCourse, cool, courseInfo, dislike, goOn, notBad, problems} from "../constants";

export const presentation = (bot: Telegraf<SessionContext>) => {
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