import { IResponse } from '../../models';
import { SuccessResponse } from './SuccessResponse';
import { AccessDeniedResponse } from './AccessDeniedResponse';
import { ServiceUnavailableResponse } from './ServiceUnavailableResponse';
import { BadRequestResponse } from './BadRequestResponse';
import { ServerErrorResponse } from './ServerErrorResponse';

export class ResponseFactory {
    public static createSuccessResponse(res: IResponse, data?: any): void {
        const response = new SuccessResponse(data);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = response.statusCode;
        res.end(JSON.stringify(response));
    }
    public static createAccessDeniedResponse(res: IResponse): void {
        const response = new AccessDeniedResponse();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = response.statusCode;
        res.end(JSON.stringify(response));
    }
    public static createServiceUnavailableResponse(res: IResponse, err?: any): void {
        const response = new ServiceUnavailableResponse(err);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = response.statusCode;
        res.end(JSON.stringify(response));
    }
    public static createBadRequestResponse(res: IResponse, err?: string): void {
        const response = new BadRequestResponse(err);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = response.statusCode;
        res.end(JSON.stringify(response));
    }
    public static createServerErrorResponse(res: IResponse, err?: any) {
        const response = new ServerErrorResponse(err);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = response.statusCode;
        res.end(JSON.stringify(response));
    }
}
