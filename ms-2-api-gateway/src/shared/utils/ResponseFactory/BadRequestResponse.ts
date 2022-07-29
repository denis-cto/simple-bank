import { ErrorResponse } from './ErrorResponse';

export class BadRequestResponse extends ErrorResponse {
    constructor(err?: string) {
        if (err) {
            super(400, [err]);
        } else {
            super(400, ['Bad request']);
        }
    }
}
