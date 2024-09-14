export interface IReq {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface IApiResponse {
  isError: boolean;
  errorText: string;
  status: number;
  statusText: string;
  response: unknown;
}
