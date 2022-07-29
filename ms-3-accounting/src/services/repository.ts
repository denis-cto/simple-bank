import Accounts from '../app/dto/accounts';
import Journal from '../app/dto/journal';
import Postings from '../app/dto/postings';
import {Sequelize} from 'sequelize-typescript';
import config from "../db/config";
export default class Repository {
	get repo(): Sequelize {
		return this._repo;
	}
	private _repo:Sequelize = null;

	constructor(){
		this.connectDb();
	}

	connectDb(): any {
		try {
			// @ts-ignore
			this._repo = new Sequelize(config.database, config.username, config.password, {...config});
			// @ts-ignore
			this._repo.addModels([Accounts, Journal, Postings])
		}
		catch(error){
			console.log("Database catch block : "+ error)
		}
	}
}
