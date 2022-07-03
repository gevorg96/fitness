import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export interface SessionContext extends Context<Update> {
    session: any;
};
