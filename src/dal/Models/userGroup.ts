import { 
    Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    ForeignKey,
    BelongsTo,
 } from 'sequelize-typescript'
import Inventory from './inventory'

@Table
export default class UserGroup extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  id: number

  @Column(DataType.TEXT)
  aim: string

  @Column(DataType.TEXT)
  age: string

  @ForeignKey(() => Inventory)
  @Column(DataType.BIGINT)
  inventoryId: number

  @BelongsTo(() => Inventory)
  inventory: Inventory
}
