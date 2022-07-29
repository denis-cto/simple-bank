'use strict';

import { ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';
import request from 'supertest';
import CORSPassThroughMiddleware from '../../src/middlewares/cors.pass.through';


describe('Test \'api\' service', () => {
  const broker = new ServiceBroker({logger: false});

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('Test \'api.hello\' action', () => {

    it('should return with \'Hello Moleculer\'', () => {
      expect(1 + 2).toBe(3);
    });

  });

  describe('Test cors.pass.through middleware', () => {
    const corsBroker = new ServiceBroker({logger: false});
    const corsService = corsBroker.createService({
      name: 'gateWay',
      mixins: [ApiGateway],
      settings: {
        port: 33333,
        use: [CORSPassThroughMiddleware],
        routes: [{
          path: '/test',
          aliases: {
            'GET cors': (req, res) => {
              res.end('ok');
            },
          },
        }],
      },
    });

    beforeEach(() => corsBroker.start());
    afterEach(() => corsBroker.stop());

    it('should send CORS headers with Access-Control-Allow-Origin set to incoming Origin value', () => request(corsService.server)
      .get('/test/cors')
      .set('Origin', 'test origin')
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.headers[ 'access-control-allow-origin' ]).toBe('test origin');
        expect(res.headers[ 'access-control-allow-methods' ]).toBe(['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'].join(', '));
        expect(res.headers[ 'access-control-expose-headers' ]).toBe('*');
        expect(res.headers[ 'access-control-allow-headers' ]).toBe('origin, x-requested-with, content-type, accept, authorization, jwt');
        expect(res.headers[ 'access-control-allow-credentials' ]).toBe('true');
        expect(res.headers[ 'access-control-max-age' ]).toBe('3600');
      }));

    it('should send 204 code on OPTIONS  request', () => request(corsService.server)
      .options('/test/cors')
      .set('Origin', 'test origin')
      .then(res => {
        expect(res.statusCode).toBe(204);
        expect(res.headers[ 'access-control-allow-origin' ]).toBe('test origin');
        expect(res.headers[ 'access-control-allow-methods' ]).toBe(['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'].join(', '));
        expect(res.headers[ 'access-control-expose-headers' ]).toBe('*');
        expect(res.headers[ 'access-control-allow-headers' ]).toBe('origin, x-requested-with, content-type, accept, authorization, jwt');
        expect(res.headers[ 'access-control-allow-credentials' ]).toBe('true');
        expect(res.headers[ 'access-control-max-age' ]).toBe('3600');
      }));

    it('should not send CORS headers if no Origin header was passed', () => request(corsService.server)
      .get('/test/cors')
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
        expect(res.headers).not.toHaveProperty('access-control-allow-methods');
        expect(res.headers).not.toHaveProperty('access-control-expose-headers');
        expect(res.headers).not.toHaveProperty('access-control-allow-headers');
        expect(res.headers).not.toHaveProperty('access-control-allow-credentials');
        expect(res.headers).not.toHaveProperty('access-control-max-age');
      }));
  });

});
