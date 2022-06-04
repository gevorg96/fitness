import { 
    Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType
 } from 'sequelize-typescript'

@Table
export default class Question extends Model {

  @PrimaryKey
  @Column(DataType.BIGINT)
  id: number

  @Column(DataType.TEXT)
  value: string

  @Column(DataType.TEXT)
  type: string
}
