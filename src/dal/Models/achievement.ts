import { Table, 
    Column, 
    Model, 
    DataType,
    PrimaryKey,
    AutoIncrement } from 'sequelize-typescript';

@Table
export default class Achievement extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number

    @Column(DataType.TEXT)
    value: string

    @Column(DataType.DATE)
    condition: Date
}