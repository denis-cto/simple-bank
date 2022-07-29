import {
  Middleware, Service, ServiceSchema,
} from 'moleculer';
import _ from 'lodash';
import {IRequest, IResponse} from '../shared/models';
import {ResponseFactory} from '../shared/utils';

const routingCache = new Map();

const dictionaries: Middleware = {
  // @ts-ignore
  serviceCreating: (service: Service, schema: ServiceSchema): any => {
    if (!schema.dictionaries) {
      return;
    }
    if (!schema.routes) {
      schema.routes = [];
    }

    const routes = {
      ...schema.dictionaries.options,
      aliases: {},
    };

    routes.aliases[ 'GET list' ] = baseGetHandler('list');
    routes.aliases[ 'GET :name' ] = baseGetHandler('getByName');
    routes.aliases[ 'GET :catalogName/:catalogMethod' ] = baseGetHandler();
    routes.aliases[ 'POST :catalogName/:catalogMethod' ] = basePostHandler();

    schema.settings.routes.push(routes);
  },
};

const baseGetHandler = (callName: string = '') => async (req: IRequest, res: IResponse) => {
  let response: any;

  let params = {...req.$params.query as any};
  if ((req.$params as any).params) {
    params = _.merge(params, {...(req.$params as any).params});
    if (params.hasOwnProperty('catalogName') && params.hasOwnProperty('catalogMethod')) {
      callName = `${params.catalogName}_${params.catalogMethod}`;
    }
  }

  return baseHandler(callName, params, req, res);
};

const basePostHandler = (callName: string = '') => async (req: IRequest, res: IResponse) => {

  let params = {...req.body as any};
  if ((req.$params as any).params) {
    params = _.merge(params, {...(req.$params as any).params});
    if (params.hasOwnProperty('catalogName') && params.hasOwnProperty('catalogMethod')) {
      callName = `${params.catalogName}_${params.catalogMethod}`;
    }
  }

  return baseHandler(callName, params, req, res);
};


const baseHandler = async (callName: string, params: any, req: IRequest, res: IResponse) => {
  let response: any;

  try {
    let remote = 'v2.catalogs';

    if (params.remote) {
      remote = params.remote;
    } else if (params.catalogName) {
      let dictionaryMeta: any;
      // TODO: normal routing
      if (routingCache.has(params.catalogName)) {
        dictionaryMeta = routingCache.get(params.catalogName);
      }

      if (!dictionaryMeta || dictionaryMeta.stamp < Date.now()) {
        const dictionaryMetaResponse: any = await req.$ctx.call('v2.catalogs.getByName', {name: params.catalogName});
        if (dictionaryMetaResponse && dictionaryMetaResponse.statusCode === 200) {
          dictionaryMeta = dictionaryMetaResponse.data;
          dictionaryMeta.stamp = Date.now() + 10 * 1000;
          routingCache.set(params.catalogName, dictionaryMeta);
        }
      }

      if (dictionaryMeta && dictionaryMeta.remote) {
        remote = dictionaryMeta.remote;
      }
    }

    delete params.catalogName;
    delete params.catalogMethod;

    response = await req.$ctx.call(`${remote}.${callName}`, params);
  } catch (error) {
    throw ResponseFactory.createServiceUnavailableResponse(res, error);
  }

  if (response.statusCode !== 200) {
    return ResponseFactory.createServerErrorResponse(res, response.error);
  } else {
    // eslint-disable-next-line id-blacklist
    return response.data === undefined && response.errors !== undefined
      ? ResponseFactory.createServerErrorResponse(res, response.errors)
      : ResponseFactory.createSuccessResponse(res, response.data);
  }
};

export default dictionaries;
