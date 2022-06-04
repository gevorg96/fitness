import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType
} from 'sequelize-typescript';

@Table
export default class Muscle extends Model {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    value: string
}