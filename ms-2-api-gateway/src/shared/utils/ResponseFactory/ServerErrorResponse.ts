import { ErrorResponse } from './ErrorResponse';

export class ServerErrorResponse extends ErrorResponse {
    constructor(err: any) {
        if (err) {
            super(500, err.message);
        } else {
            super(500, 'Internal server error');
        }
    }
}
