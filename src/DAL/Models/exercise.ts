import Inventory from './inventory';
import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    ForeignKey,
    BelongsTo} from 'sequelize-typescript';
import Muscle from './muscle';

@Table
export default class Exercise extends Model {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    value: string

    @ForeignKey(() => Muscle)
    @Column(DataType.BIGINT)
    muscleId: number

    @BelongsTo(() => Muscle)
    muscle: Muscle

    @ForeignKey(() => Inventory)
    @Column(DataType.BIGINT)
    inventoryId: number

    @BelongsTo(() => Inventory)
    inventory: Inventory
}