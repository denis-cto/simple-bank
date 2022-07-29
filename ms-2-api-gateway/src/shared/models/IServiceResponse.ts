export interface IServiceResponse<T> {
    status: string;
    statusCode: number;
    data?: T;
    // eslint-disable-next-line @typescript-eslint/ban-types
    error?: [object | string];
}
