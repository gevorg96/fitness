import UserGroup from './userGroup';
import Achievement from './achievement';
import { Table, 
    Column, 
    Model, 
    DataType,
    ForeignKey,
    BelongsTo, 
    PrimaryKey} from 'sequelize-typescript';

@Table
export default class User extends Model {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id!: number

    @Column(DataType.TEXT)
    name: string

    @Column(DataType.TEXT)
    login: string
  
    @Column(DataType.DATE)
    paidTo: Date

    @ForeignKey(() => UserGroup)
    @Column(DataType.BIGINT)
    userGroupId: number
  
    @BelongsTo(() => UserGroup)
    userGroup: UserGroup
  
    @ForeignKey(() => Achievement)
    @Column(DataType.BIGINT)
    achievementId: number
  
    @BelongsTo(() => Achievement)
    achievement: Achievement
}