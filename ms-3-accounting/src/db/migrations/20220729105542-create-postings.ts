/* eslint-disable @typescript-eslint/naming-convention */
import Sequelize, { QueryInterface, DataTypes } from "sequelize";

export = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
		await queryInterface.createTable("Journal", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: Sequelize.literal("gen_random_uuid()"),
			},
			accountId: {
				allowNull: false,
				type: DataTypes.UUID,
				references: {
					model: "Accounts",
					key: "accountId",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		});
		await queryInterface.createTable("Postings", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: Sequelize.literal("gen_random_uuid()"),
			},
			journalId: {
				allowNull: false,
				type: DataTypes.UUID,
				references: {
					model: "Journal",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			accountId: {
				allowNull: false,
				type: DataTypes.UUID,
				references: {
					model: "Accounts",
					key: "accountId",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
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
		await queryInterface.sequelize.query(`
		    DROP FUNCTION IF EXISTS updateBalance() cascade;
			CREATE FUNCTION updateBalance() RETURNS trigger
				LANGUAGE plpgsql
				SET SCHEMA 'public'
			AS
			$$
			DECLARE
			newbalance decimal(10,2);
			BEGIN
				-- Data validation
				IF COALESCE(NEW.debit, 0) < 0 THEN
					RAISE EXCEPTION 'Debit value must be non-negative';
				END IF;

				IF COALESCE(NEW.credit, 0) < 0 THEN
					RAISE EXCEPTION 'Credit value must be non-negative';
				END IF;

				-- Update Current Table balance

				NEW.balance =  COALESCE(NEW.debit, 0) -  COALESCE(NEW.credit, 0);

				RETURN NEW;
			END;

			$$;

			CREATE TRIGGER updateBalanceTrigger
				BEFORE UPDATE
				ON "Postings"
				FOR EACH ROW
			EXECUTE PROCEDURE updateBalance();

			CREATE TRIGGER insertBalanceTrigger
				BEFORE INSERT
				ON "Postings"
				FOR EACH ROW
			EXECUTE PROCEDURE updateBalance();
			`);
		await queryInterface.sequelize.query(`
		DROP FUNCTION IF EXISTS updateDebitCredit();
			CREATE FUNCTION updateDebitCredit() RETURNS trigger
				LANGUAGE plpgsql
				SET SCHEMA 'public'
			AS
			$$
			BEGIN
				-- Update Account balances

				IF (TG_OP = 'INSERT') THEN
					UPDATE "Accounts"
					SET credit =  credit + COALESCE(NEW.credit, 0),
					debit =  debit + COALESCE(NEW.debit, 0)
					WHERE "accountId" = NEW."accountId";

					RETURN NEW;
				ELSIF (TG_OP = 'UPDATE') THEN
					UPDATE "Accounts"
					SET credit =  credit - COALESCE(OLD.credit, 0),
					debit =  debit - COALESCE(OLD.debit, 0)
					WHERE "accountId" = OLD."accountId";

					UPDATE "Accounts"
					SET credit =  credit + COALESCE(NEW.credit, 0),
					debit =  debit + COALESCE(NEW.debit, 0)
					WHERE "accountId" = NEW."accountId";

					RETURN NEW;
				ELSIF (TG_OP = 'DELETE') THEN
					UPDATE "Accounts"
					SET credit =  credit - COALESCE(OLD.credit, 0),
					debit =  debit - COALESCE(OLD.debit, 0)
					WHERE "accountId" = OLD."accountId";

					RETURN OLD; -- ignored on delete
				END IF;
			END;
			$$;

			CREATE TRIGGER updateDebitCreditTrigger
				AFTER UPDATE
				ON "Postings"
				FOR EACH ROW
			EXECUTE PROCEDURE updateDebitCredit();

			CREATE TRIGGER insertDebitCreditTrigger
				AFTER INSERT
				ON "Postings"
				FOR EACH ROW
			EXECUTE PROCEDURE updateDebitCredit();

			CREATE TRIGGER deleteDebitCreditTrigger
				AFTER DELETE
				ON "Postings"
				FOR EACH ROW
			EXECUTE PROCEDURE updateDebitCredit();

			`);

		},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.dropTable("Postings", { cascade: true});
		await queryInterface.dropTable("Journal", { cascade: true});
		await queryInterface.sequelize.query("DROP FUNCTION IF EXISTS updateBalance() cascade;");
		await queryInterface.sequelize.query("DROP FUNCTION IF EXISTS updateDebitCredit() cascade;");
	},
};
