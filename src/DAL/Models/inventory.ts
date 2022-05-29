import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement } from 'sequelize-typescript';

@Table
export default class Inventory extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    name: string
}