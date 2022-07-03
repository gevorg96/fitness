import {Repository} from "sequelize-typescript";
import User from "../dal/Models/user";
import sequelize from "../dal/sequelize";

export class UserService {
    private get repository(): Repository<User> {
        return sequelize.getRepository(User);
    }

    async getUserById(id: number) {
        await this.repository.findOne({where: {id: id}})
    }

    async addOrUpdate(user: User) {
        await this.repository.upsert({
            id: user.id,
            userGroupId: user.userGroupId,
            userGroup: user.userGroup,
            name: user.name,
            login: user.login,
            gender: user.gender,
            email: user.email,
            city: user.city,
            paidTo: user.paidTo,
            achievementId: user.achievementId,
            achievement: user.achievement
        });
    }
    
    async update<T>(id: number, field: string, value: T) {
        let obj: any = {}
        obj[field] = value

        console.log(id)
        console.log(obj)
        
        await this.repository.update(obj, {where: {id: id}})
    }
    
    async init(id: number) {
        let user = await this.getUserById(id);
        if (user !== null) {
            return
        }
        
        await this.repository.create({id: id})
    }
}