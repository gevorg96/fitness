import { Table, 
    Column, 
    Model, 
    DataType,
    AutoIncrement,
    PrimaryKey,
    ForeignKey,
    BelongsTo} from 'sequelize-typescript';
import Exercise from './exercise';
import UserGroup from './userGroup';
import Inventory from './inventory';
import MuscleGroup from './muscleGroup';

@Table
export default class ExerciseGroup extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number

    @ForeignKey(() => Exercise)
    @Column(DataType.BIGINT)
    exerciseId: number

    @BelongsTo(() => Exercise)
    exercise: Exercise

    @ForeignKey(() => UserGroup)
    @Column(DataType.BIGINT)
    userGroupId: number

    @BelongsTo(() => UserGroup)
    userGroup: UserGroup

    @ForeignKey(() => Inventory)
    @Column(DataType.BIGINT)
    inventoryId: number

    @BelongsTo(() => Inventory)
    inventory: Inventory

    @ForeignKey(() => MuscleGroup)
    @Column(DataType.BIGINT)
    muscleGroupId: number

    @BelongsTo(() => MuscleGroup)
    muscleGroup: MuscleGroup

    // sets, repetitions, relax, weekday, month 
    // research dataTypes
}