import {
	Table, Column, DataType, AllowNull,
	PrimaryKey, Model, Default, IsUUID,
} from "sequelize-typescript";

@Table({
	tableName: "Journal",
	timestamps: false,
})
export default class Journal extends Model<Journal> {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column(DataType.UUID)
	public id!: string;

	@AllowNull(false)
	@Column(DataType.UUID)
	public accountId!: string;

	@Column(DataType.STRING)
	public description?: string | null;
}

