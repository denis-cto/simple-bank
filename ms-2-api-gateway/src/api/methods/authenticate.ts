/* eslint-disable object-shorthand */

import { Context } from 'moleculer';
import { ResponseFactory } from '../../shared/utils';
import { IRequest, IResponse, IServiceResponse } from '../../shared/models';

export const authenticate = async (ctx: Context, route: string, req: IRequest, res: IResponse) => {
	const { jwt } = req.headers;

	if (jwt) {
		let oauthResponse: IServiceResponse<string>;

		try {
			oauthResponse = await ctx.call<IServiceResponse<any>, any>('v1.services.auth.checkToken', {jwt: jwt});
		} catch (error) {
			throw ResponseFactory.createServiceUnavailableResponse(res, error);
		}

		if (oauthResponse.statusCode === 200) {
			return oauthResponse.data[0];
		} else {
			throw ResponseFactory.createBadRequestResponse(res, 'Wrong credentials');
		}
	} else {
		throw ResponseFactory.createBadRequestResponse(res, 'There is no JWT in headers');
	}
};
