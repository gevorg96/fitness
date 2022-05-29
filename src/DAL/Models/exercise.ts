import MuscleGroup from './muscleGroup';
import Inventory from './inventory';
import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement, 
    ForeignKey,
    BelongsTo} from 'sequelize-typescript';

@Table
export default class Exercise extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    name: string

    @ForeignKey(() => MuscleGroup)
    @Column(DataType.BIGINT)
    muscleGroupId: number

    @BelongsTo(() => MuscleGroup)
    muscleGroup: MuscleGroup

    @ForeignKey(() => Inventory)
    @Column(DataType.BIGINT)
    inventoryId: number

    @BelongsTo(() => Inventory)
    inventory: Inventory
}