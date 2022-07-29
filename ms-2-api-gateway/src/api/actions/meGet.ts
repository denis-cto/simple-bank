import {IRequest, IResponse} from '../../shared/models';
import {ResponseFactory} from '../../shared/utils';

export const meGet = async (req: IRequest, res: IResponse) => {

  let oauthResponse;

  try {
    oauthResponse = await req.$ctx.call('v1.services.auth.me');
  } catch (error) {
    throw ResponseFactory.createServiceUnavailableResponse(res, error);
  }

  if (oauthResponse.statusCode === 200) {
    return ResponseFactory.createSuccessResponse(res, [oauthResponse.data]);
  } else {
    throw ResponseFactory.createBadRequestResponse(res, 'Wrong credentials');
  }
};
