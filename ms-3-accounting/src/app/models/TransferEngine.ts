import Accounts from "../dto/accounts";
import Transaction from "sequelize/types/lib/transaction";
import {Sequelize} from "sequelize-typescript";
import Journal from "../dto/journal";
import Postings from "../dto/postings";

export default class TransferEngine {
	private readonly sourceAccount: string;
	private db: Sequelize;

	constructor(sourceAccount: string, db: Sequelize) {
		this.sourceAccount = sourceAccount;
		this.db = db;
	}

	public async transferTransaction(destinationAccount: string, amount: number, description?: string | null) {
		TransferEngine.throwIfNegativeAmount(amount);
		await this.throwIfNotEnoughMoney(amount);
		const transaction = await this.db.transaction({autocommit: false});
		try {
			// @ts-ignore
			const journal = await Journal.create({accountId: this.sourceAccount, description}, {transaction});
			await TransferEngine.makeDoubleEntry(journal.id, amount, this.sourceAccount, destinationAccount, transaction);
			await transaction.commit();
		} catch (e) {
			await transaction.rollback();
			throw e;
		}

	}

	private static async makeDoubleEntry(journalId: string, amount: number, sourceAccount: string, destinationAccount: string, transaction: Transaction): Promise<Postings[]> {
		if (sourceAccount === destinationAccount) {
			throw new Error('Operation is useless, source and destination are equal');
		}
		// @ts-ignore
		const debitOperation = await Postings.create({
			journalId,
			accountId: destinationAccount,
			debit: amount,
		}, {transaction});
		// @ts-ignore
		const creditOperation = await Postings.create({
			journalId,
			accountId: sourceAccount,
			credit: amount,
		}, {transaction});
		return [creditOperation, debitOperation];
	}

	private static throwIfNegativeAmount(amount: number): void {
		if (amount < 0) {
			throw new Error('Amount cannot be negative');
		}
	}

	private async throwIfNotEnoughMoney(amount: number): Promise<void> {
		const account = await Accounts.findByPk(this.sourceAccount);
		if (amount > account.balance) {
			throw new Error('Not enough money on source account');
		}
	}

}
