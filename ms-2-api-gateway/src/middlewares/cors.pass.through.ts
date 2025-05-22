import { IncomingMessage, ServerResponse } from 'http';

export default (req: IncomingMessage, res: ServerResponse, next: any): void => {
  if (req.headers.hasOwnProperty('origin') && req.headers.origin.trim() !== '') {
    const origin = req.headers.origin;xw

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
