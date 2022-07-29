import { ErrorResponse } from './ErrorResponse';

export class ServiceUnavailableResponse extends ErrorResponse {
    constructor(err?: any) {
        if (err) {
            if (err.data && err.data.action) {
                super(503, [`Service ${err.data.action} does not available.`]);
            } else {
                super(503, [err]);
            }
        } else {
            super(503, ['Calling service does not available.']);
        }
    }
}
