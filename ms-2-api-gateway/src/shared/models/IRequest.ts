import { Context } from 'moleculer';
import { IHeaders } from './IHeaders';

export interface IRequest extends Request {
    $params: any;
    $ctx?: Context;
    body: any;
    headers: IHeaders;
    $endpoint: any;
    $route: any;
}
