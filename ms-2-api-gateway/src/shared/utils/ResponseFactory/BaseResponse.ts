/* Tslint:disable */
import { IServiceResponse } from '../../models';

export class BaseResponse<T> implements IServiceResponse<T> {
	status: string;
	statusCode: number;
	data?: T;
	// eslint-disable-next-line @typescript-eslint/ban-types
	error?: [string | object];

	constructor(status: string, statusCode: number, data?: T, error?: any) {
		this.status = status;
		this.statusCode = statusCode;
		this.data = data;
		this.error = error;
	}
}
