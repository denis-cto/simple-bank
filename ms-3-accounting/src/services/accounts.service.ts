"use strict";

import {Service, ServiceBroker, Context} from "moleculer";
import ITransferParams from "./interfaces/ITransferParams";
import Accounts from "../app/dto/accounts";
import TransferEngine from "../app/models/TransferEngine";
import {Sequelize} from "sequelize-typescript";
import Repository from "./repository";

export default class AccountsService extends Service {
	protected db!: Sequelize;
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "accounting",
			actions:{
				account: {
					rest: {
						method: "GET",
						path: "/account",
					},
					params: {
						id: "string",
					},
					async handler(ctx: Context<{id: string}>): Promise<string> {
						return this.getAccount(ctx.params.id);
					},
				},
				transfer: {
					rest: {
						method: "POST",
						path: "/transfer",
					},
					params: {
						sourceAccountId: "string",
						destinationAccountId: "string",
						currency: "string",
						amount: "number",
					},
					async handler(ctx: Context<ITransferParams>): Promise<string> {
						return this.transferAmount(ctx.params);
					},
				},
			},
		});
		this.db = new Repository().repo;
	}

	public async getAccount(id: string): Promise<string> {
		return id;
	}
	public async transferAmount(params: ITransferParams): Promise<any> {
		const sourceAccount = await Accounts.findByPk(params.sourceAccountId);
		if (!sourceAccount) {
			throw new Error('Source account doesn\'t exist');
		}
		const destinationAccount = await Accounts.findByPk(params.destinationAccountId);
		if (!destinationAccount) {
			throw new Error('Destination account doesn\'t exist');
		}
		const transfer = new TransferEngine(
			sourceAccount.accountId,
			this.db
		);
		await transfer.transferTransaction(destinationAccount.accountId, params.amount, params.description);
		await Promise.all([sourceAccount.reload(), destinationAccount.reload()]);
		return {
			sourceAccountBalance: sourceAccount.balance,
			destinationAccountBalance: destinationAccount.balance
		}
	}
}
