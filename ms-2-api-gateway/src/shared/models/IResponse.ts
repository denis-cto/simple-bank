export interface IResponse  extends Response{
    statusCode: number;
    setHeader: (key: string, value: string) => void;
    end: (body: string) => void;
}
