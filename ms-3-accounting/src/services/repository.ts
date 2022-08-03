import {Sequelize} from "sequelize-typescript";
import Accounts from "../app/dto/accounts";
import Journal from "../app/dto/journal";
import Postings from "../app/dto/postings";
import * as DbConfig from "../../src/db/config"
export default class Repository {
	get repo(): Sequelize {
		return this._repo;
	}
	private _repo: Sequelize = null;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	constructor(){
		this.connectDb();
	}

	connectDb(): any {
		try {
			console.log("Config : "+ JSON.stringify(DbConfig));

			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			this._repo = new Sequelize(DbConfig.database, DbConfig.username, DbConfig.password, DbConfig);
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			this._repo.addModels([Accounts, Journal, Postings]);
		}
		catch(error){
			console.log("Database catch block : "+ error);
		}
	}
}
