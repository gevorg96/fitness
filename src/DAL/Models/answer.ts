import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    ForeignKey,
    AutoIncrement,
    BelongsTo } from 'sequelize-typescript';
import Question from './question'

@Table
export default class Answer extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    text: string

    @ForeignKey(() => Question)
    @Column(DataType.BIGINT)
    questionId: number

    @BelongsTo(() => Question)
    question: Question
}