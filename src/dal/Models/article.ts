import { Table, 
    Column, 
    Model, 
    PrimaryKey, 
    DataType, 
    AutoIncrement } from 'sequelize-typescript';

@Table
export default class Article extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number
  
    @Column(DataType.TEXT)
    link: string
}