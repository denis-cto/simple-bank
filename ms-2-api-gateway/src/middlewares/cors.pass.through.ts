import { IncomingMessage, ServerResponse } from 'http';

export default (req: IncomingMessage, res: ServerResponse, next: any): void => {
  if (req.headers.hasOwnProperty('origin') && req.headers.origin.trim() !== '') {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', [ 'GET', 'OPTIONS', 'POST', 'PUT', 'DELETE' ].join(', '));
    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, accept, authorization, jwt');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader('Access-Control-Max-Age', 8000);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Content-Length': '0',
      });
      res.end();
      return;
    }
  }
  next();
};
