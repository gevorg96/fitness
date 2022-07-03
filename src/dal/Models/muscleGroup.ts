import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType
} from 'sequelize-typescript';

@Table
export default class MuscleGroup extends Model {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    value: string

    @Column(DataType.TEXT)
    dayNum: string

    @Column(DataType.TEXT)
    month: string
}