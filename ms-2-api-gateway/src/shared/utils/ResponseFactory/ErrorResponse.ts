import { BaseResponse } from './BaseResponse';

export class ErrorResponse extends BaseResponse<any> {
    constructor(statusCode: number, error?: any) {
      super('error', statusCode, null, error);
    }
  }
