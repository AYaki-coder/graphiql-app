export interface IReq {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}
