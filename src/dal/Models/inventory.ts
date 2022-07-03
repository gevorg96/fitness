import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType
} from 'sequelize-typescript';

@Table
export default class Inventory extends Model {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    value: string
}