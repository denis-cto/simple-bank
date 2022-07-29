import { Middleware } from 'moleculer';

export const CallInterceptor: Middleware = {
    call: () => (actionName, params, opts) => new Promise((resolve, reject) => {
      resolve({statusCode: 200, data: {actionName, params}});
    }),
  };
