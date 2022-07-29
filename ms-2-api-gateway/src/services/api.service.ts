import { ServiceSchema } from 'moleculer';
import ApiGateway from 'moleculer-web';
import { ResponseFactory } from '../shared/utils';
import { authenticate } from '../api/methods';
import CORSPassThrough from '../middlewares/cors.pass.through';

const ApiService: ServiceSchema = {
  name: 'apiGateway`',
  mixins: [
    ApiGateway,
  ],
  settings: {
    use: [CORSPassThrough],
    port: process.env.PORT || 3000,
    io: {
      kafka: {
        host: process.env.MS_CFG_SOCKET_IO_KAFKA_HOST || 'kafka',
        port: process.env.MS_CFG_SOCKET_IO_KAFKA_PORT || 9092,
      },
      namespaces: {
        '/': {
          subscriptions: [],
          events: {
            query: {
              autoJoin: true,
              autoAlias: true,
            },
          },
        },
      },
      options: {
        allowRequest: (req, callback) => callback(null, true),
        cors: {
          origin: ['null', 'http://localhost:3000', 'https://localhost:3000'],
          methods: ['GET', 'POST'],
          allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
          credentials: true,
        },
      },
    },
    servers: [
    ],
    schema: null,
    shouldUpdateSchema: true,
    routes: [
    // Expiremental autoAlias routes
    {
      path: '/api',
      // Use bodyparser module
      bodyParsers: {
        json: true,
        urlencoded: { extended: true },
      },
      whitelist: [
        'v1.services.api-gateway.*',
        'accounting.*',
      ],
      autoAliases: true,
    },
    ],
    onError: (req: any, res: any, err: any) => {
      ResponseFactory.createServerErrorResponse(res, err);
      return Promise.resolve();
    },
  },
  methods: { authenticate },
};

export = ApiService;
