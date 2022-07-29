/* eslint-disable @typescript-eslint/naming-convention */
import Sequelize, { QueryInterface, DataTypes } from "sequelize";

export = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
		await queryInterface.createTable("Accounts", {
			accountId: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
			},
			currency: {
				type: DataTypes.STRING(3),
				defaultValue: "EUR",
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: Sequelize.literal('NOW()'),
			},
			balance: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				defaultValue: 0,
			},
			debit: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				defaultValue: 0,
			},
			credit: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				defaultValue: 0,
			},
		});
		await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS updateAccountBalance();
			CREATE FUNCTION updateAccountBalance() RETURNS trigger
				LANGUAGE plpgsql
				SET SCHEMA 'public'
			AS
			$$
			DECLARE
			newbalance decimal(10,2);
			BEGIN

			-- Data validation
			RAISE NOTICE 'NEW: %', NEW;

			NEW.balance =  COALESCE(NEW.debit, 0) -  COALESCE(NEW.credit, 0);

			IF NEW.balance < 0 THEN
				RAISE EXCEPTION 'Insufficient funds: %', NEW;
			END IF;

			RETURN NEW;
			END;

			$$;

			CREATE TRIGGER updateAccountBalanceTrigger
				BEFORE UPDATE
				ON "Accounts"
				FOR EACH ROW
			EXECUTE PROCEDURE updateAccountBalance();

			CREATE TRIGGER insertAccountBalanceTrigger
				BEFORE INSERT
				ON "Accounts"
				FOR EACH ROW
			EXECUTE PROCEDURE updateAccountBalance();

			`);

		},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.query('DROP EXTENSION IF EXIST "uuid-ossp";');
		return queryInterface.dropTable("Accounts");
	},
};
