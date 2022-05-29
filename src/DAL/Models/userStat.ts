import User from './user';
import Question from './question';
import Answer from './answer';
import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement,
    ForeignKey,
    BelongsTo } from 'sequelize-typescript';

@Table
export default class UserStat extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number
  
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId: number
  
    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => Question)
    @Column(DataType.BIGINT)
    questionId: number
  
    @BelongsTo(() => Question)
    question: Question

    @ForeignKey(() => Answer)
    @Column(DataType.BIGINT)
    answerId: number
  
    @BelongsTo(() => Answer)
    answer: Answer

    @Column(DataType.DATE)
    date: Date
}