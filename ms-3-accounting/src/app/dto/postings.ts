import {
	Table, Column, DataType, AllowNull,
	PrimaryKey, Model, Default,
} from "sequelize-typescript";

@Table({
	tableName: "Postings",
	timestamps: false,
})
export default class Postings extends Model<Postings> {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column(DataType.UUID)
	public id!: string;

	@AllowNull(false)
	@Column(DataType.UUID)
	public journalId!: string;

	@AllowNull(false)
	@Column(DataType.UUID)
	public accountId!: string;

	@Column(DataType.DECIMAL)
	public balance?: number | null;

	@Column(DataType.DECIMAL)
	public debit?: number | null;

	@Column(DataType.DECIMAL)
	public credit?: number | null;

}

