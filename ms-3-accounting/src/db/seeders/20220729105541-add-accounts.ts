/* eslint-disable @typescript-eslint/naming-convention */
import {QueryInterface} from "sequelize";

export = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.query(
			'INSERT INTO "Accounts" ("accountId", "debit") VALUES (\'00000000-0000-0000-1111-111111111111\', 1000 );' +
			'INSERT INTO "Accounts" ("accountId", "debit") VALUES (\'22222222-0000-0000-0000-000000000000\', 1000);');
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.query('DELETE FROM "Accounts" where "accountId" = \'00000000-0000-0000-1111-111111111111\';');
		await queryInterface.sequelize.query('DELETE FROM "Accounts" where "accountId" = \'22222222-0000-0000-0000-000000000000\';');
	},
};
