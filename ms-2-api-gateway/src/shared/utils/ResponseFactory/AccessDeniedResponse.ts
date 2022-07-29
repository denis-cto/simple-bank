import { ErrorResponse } from './ErrorResponse';

export class AccessDeniedResponse extends ErrorResponse {
    constructor() {
      super(403, ['Forbidden']);
    }
  }
