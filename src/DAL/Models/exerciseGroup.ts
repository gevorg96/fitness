import { Table, 
    Column, 
    Model, 
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo} from 'sequelize-typescript';
import Exercise from './exercise';
import MuscleGroup from './muscleGroup';

@Table
export default class ExerciseGroup extends Model {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id: number

    @ForeignKey(() => Exercise)
    @Column(DataType.BIGINT)
    exerciseId: number

    @BelongsTo(() => Exercise)
    exercise: Exercise

    @ForeignKey(() => MuscleGroup)
    @Column(DataType.BIGINT)
    muscleGroupId: number

    @BelongsTo(() => MuscleGroup)
    muscleGroup: MuscleGroup
}