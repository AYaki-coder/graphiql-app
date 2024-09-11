export interface ResponseProps {
  status: number;
  type: ResponseType;
  data: unknown;
}

export enum ResponseType {
  JSON = 'json',
  TEXT = 'text',
  ERROR = 'error',
}
