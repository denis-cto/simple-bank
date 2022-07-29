import {IRequest, IResponse, IServiceResponse} from './models';
import {ResponseFactory} from './utils';

export const modelGetList = (method: string) => {

  const getList = async (req: IRequest, res: IResponse) => {
    let response;

    try {
      response = await req.$ctx.call(`${method}.list`) as any;
    } catch (error) {
      throw ResponseFactory.createServiceUnavailableResponse(res, error);
    }

    return ResponseFactory.createSuccessResponse(res, {
      list: response.rows,
      pagination: {
        page: response.page,
        perPage: response.pageSize,
        sort: 'none',
        totalItems: response.totalPages * response.pageSize,
        totalPages: response.totalPages,
      },
    });
  };

  return getList;
};

export const modelSaveForm = (method: string) => {

  const SaveForm = async (req: IRequest, res: IResponse) => {
    let responseService: any;
    let response: IServiceResponse<any>;
    if (!req.body) {
      throw ResponseFactory.createBadRequestResponse(res, 'Empty body!!!!! There is no Events');
    }

    try {
      if (req.body[`${method}Id`]) {
        responseService = await req.$ctx.call(`${method}.update`, {
          ...req.body,
        });
      }
      else {
        responseService = await req.$ctx.call(`${method}.create`, {
          ...req.body,
        });
      }
    } catch (error) {
      throw ResponseFactory.createServiceUnavailableResponse(res, error);
    }

    if (!responseService[`${method}Id`]) {
      throw ResponseFactory.createServerErrorResponse(res, response.error);
    } else {
      return ResponseFactory.createSuccessResponse(res, responseService);
    }
  };

  return SaveForm;
};
