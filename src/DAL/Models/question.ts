import { 
    Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement,
 } from 'sequelize-typescript'

@Table
export default class Question extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number

  @Column(DataType.TEXT)
  text: string

  @Column(DataType.TEXT)
  type: string
}
