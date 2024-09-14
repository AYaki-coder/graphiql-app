export type TRestVariable = string;
export type TRestVariables = Record<TRestVariable, string>;

export interface IRestVariablesSelectorProps {
  variables: TRestVariables;
  onVariablesChange: (variables: TRestVariables) => void;
  showTitle?: boolean;
  disabled?: boolean;
  className?: string;
}
