export type THeaderName = string;
export type THeaders = Record<THeaderName, string>;

export interface IHeadersSelectorProps {
  notifyOnInit: boolean;
  notifyOnChange: boolean;
  addDefaultContentType: boolean;
  onHeadersChange: (headers: THeaders) => void;
  showTitle?: boolean;
  isGraphQl?: boolean;
  className?: string;
  titleClassName?: string;
  inputsClassName?: string;
  tabsClassName?: string;
}
