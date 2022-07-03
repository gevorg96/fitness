import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement } from 'sequelize-typescript';

@Table
export default class Menu extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    header: string

    @Column(DataType.TEXT)
    text: string
}