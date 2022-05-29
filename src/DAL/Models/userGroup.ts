import { 
    Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement,
 } from 'sequelize-typescript'

@Table
export default class UserGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number

  @Column(DataType.TEXT)
  gender: string

  @Column(DataType.TEXT)
  aim: string

  @Column(DataType.INTEGER)
  age: number

  @Column(DataType.TEXT)
  bodyType: string

  @Column(DataType.TEXT)
  activity: string

  @Column(DataType.TEXT)
  inventory: string

  @Column(DataType.DATE)
  timeArticle: Date

  @Column(DataType.DATE)
  timeExercise: Date
}
