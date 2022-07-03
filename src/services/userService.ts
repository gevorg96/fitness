import {Repository} from "sequelize-typescript";
import User from "../dal/Models/user";
import sequelize from "../dal/sequelize";
import {getKeyValue} from "../utils/getKeyValues";

export class UserService {
    private get repository(): Repository<User> {
        return sequelize.getRepository(User);
    }

    async getUserById(id: number) {
        return await this.repository.findOne({where: {id: id}})
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
    
    async update(id: number, updateModel: UpdateUserDto) {
        let obj: any = {}
        Object.keys(updateModel).forEach(x => {
            console.log(x)
            let res = getKeyValue<keyof UpdateUserDto, UpdateUserDto>(x as UpdateKeys)(updateModel);
            console.log(res)
            obj[x] = res.value
        })
        
        await this.repository.update(obj, {where: {id: id}})
    }
    
    async init(id: number) {
        let user = await this.getUserById(id);
        if (user) {
            return
        }
        
        await this.repository.create({id: id})
    }
}