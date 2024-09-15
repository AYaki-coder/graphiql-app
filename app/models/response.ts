export interface ResponseViewProps {
  status: number;
  type: ResponseViewType;
  data: unknown;
}

export enum ResponseViewType {
  JSON = 'json',
  TEXT = 'text',
  ERROR = 'error',
}
