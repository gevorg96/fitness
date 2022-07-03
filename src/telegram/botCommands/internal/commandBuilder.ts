import {Markup} from "telegraf";

interface Command {
    name?: string,
    callback?: string,
    commands?: Command[]
}

export class CommandBuilder {
    private _commands: Command[];
    
    constructor() {
        this._commands = []
    }
    
    add(name: string, callback: string) {
        this._commands.push({name, callback, commands: null})
        return this;
    }
    
    bulkAdd(c: Command[]) {
        this._commands.push({commands: c})
        return this;
    }
    
    build() {
        let buttons = this._commands.map(x => {
            if (x.commands !== null) {
                return x.commands.map(x => Markup.button.callback(x.name, x.callback))
            }
            else {
                return [Markup.button.callback(x.name, x.callback)]
            }
        })
        
        return Markup.inlineKeyboard(buttons)
    }
}
