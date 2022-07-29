# API Gateway

Routing microservice.

### How it works?

1. Request with contrib without JWT generates a call [OAuthService](https://gitlab.com/greenatom/oauthservice) auth method (??? method name) 
with success answer (status 200 + JWT) or err.
2. Request with JWT generates a call to the called service with params from request and JWT as param or meta (?) for getting permissions later in the service.
3. Not correct request or not valid or another requests generates an error page.
4. All requests and responces validates. 

### How to install?

Note: prefer to use yarn than npm. `yarn.lock` included

1. `yarn install` - to install modules
2. `yarn build` - to build app (tsc -> js)
3. `yarn lint` - to run linter (ESlint)
4. `yarn test` - to run jest tests
5. `yarn dc:up` - to run docker container with kafka (microservice transport). You can uncomment in `docker-compose.yml` lines with postgres if you need it.
Run docker before `yarn start` or `yarn dev`!!!
6. `yarn start` - start prod mode (not relased yet)
7. `yarn dev` - start dev mode without build(you can use .ts) and with connect to kafka in docker
8. `yarn dc:down` - to stop docker