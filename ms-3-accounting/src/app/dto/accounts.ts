import {
	Table, Column, DataType, AllowNull,
	PrimaryKey, Model, UpdatedAt,
} from "sequelize-typescript";

@Table({
	tableName: "Accounts",
	timestamps: false,
})
export default class Accounts extends Model<Accounts> {
	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.UUID)
	public accountId!: string;

	@Column(DataType.STRING(3))
	public currency!: string;

	@Column(DataType.DECIMAL)
	public balance: number;

	@Column(DataType.DECIMAL)
	public debit: number;

	@Column(DataType.DECIMAL)
	public credit: number;

	@UpdatedAt
	public updatedAt: Date;
}

