// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface ITransferParams {
	sourceAccountId: string;
	destinationAccountId: string;
	currency: string;
	amount: number;
	description: string;
}
