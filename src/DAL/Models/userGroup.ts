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
import Inventory from './inventory'

@Table
export default class UserGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number

  @Column(DataType.TEXT)
  aim: string

  @Column(DataType.INTEGER)
  age: number

  @ForeignKey(() => Inventory)
  @Column(DataType.BIGINT)
  inventoryId: number

  @BelongsTo(() => Inventory)
  inventory: Inventory
}
