import { 
    Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement,
    ForeignKey,
    BelongsTo,
 } from 'sequelize-typescript'
import Article from './article'
import Exercise from './exercise'
import User from './user'

@Table
export default class UserExercise extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number

  @ForeignKey(() => Exercise)
  @Column(DataType.BIGINT)
  exerciseId: number

  @BelongsTo(() => Exercise)
  exercise: Exercise

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId: number

  @BelongsTo(() => User)
  user: User

  @Column(DataType.INTEGER)
  sets: number

  @Column(DataType.INTEGER)
  repetitions: number

  @Column(DataType.INTEGER)
  relax: number

  @Column(DataType.TEXT)
  weekday: string

  @Column(DataType.DATE)
  dateFrom: Date

  @Column(DataType.DATE)
  dateTo: Date

  @Column(DataType.DATE)
  timeExercise: Date

  @Column(DataType.DATE)
  timeArticle: Date

  @ForeignKey(() => Article)
  @Column(DataType.BIGINT)
  nextArticleId: number

  @BelongsTo(() => Article)
  nextArticle: Article
}
