import _ from 'lodash';
import { useCallback, useContext, useEffect, useRef } from 'react';
import s from './rest-variables-selector.module.scss';
import { LangContext } from '../lang-context/lang-context';
import classNames from 'classnames';
import { IRestVariablesSelectorProps, TRestVariables } from '~/models/rest-variables-selector';

export function RestVariablesSelector(props: IRestVariablesSelectorProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { langRecord } = useContext(LangContext);

  const variablesArray = Object.entries(props.variables);

  const changeVariable = useCallback(
    (name: string, value: string, isSet: boolean) => {
      let newVars: TRestVariables;
      if (isSet) {
        newVars = { ...props.variables, [name]: value };
      } else {
        newVars = _.omit(props.variables, [name]);
      }

      props.onVariablesChange(newVars);
    },
    [props.variables],
  );

  const setVariableToForm = useCallback(
    (name: string, value: string) => {
      if (nameRef && nameRef.current && valueRef && valueRef.current) {
        nameRef.current.value = name;
        valueRef.current.value = value;
      }
    },
    [nameRef, valueRef],
  );

  return (
    <div className={classNames(s.variablesContainer, props.className)}>
      {props.showTitle && <h4 className={s.variablesTitle}>{langRecord.restVariablesSelector?.titleText ?? ''}:</h4>}

      <section className={s.fieldset}>
        <input
          type="text"
          disabled={props.disabled}
          className={classNames(s.variableInput, s.formControl, s.nameInput)}
          placeholder={langRecord.restVariablesSelector?.variableNameInputPlaceholder ?? ''}
          ref={nameRef}
        />
        <input
          disabled={props.disabled}
          type="text"
          className={classNames(s.variableInput, s.formControl, s.valueInput)}
          placeholder={langRecord.restVariablesSelector?.variableValueInputPlaceholder ?? ''}
          ref={valueRef}
        />
        <button
          disabled={props.disabled}
          type="button"
          className={classNames(s.btn, s.btnLight, s.addBtn)}
          onClick={event => {
            event.preventDefault();

            const name = nameRef.current?.value?.trim();
            const value = valueRef.current?.value?.trim();

            if (nameRef.current && valueRef.current && name && value) {
              nameRef.current.value = '';
              valueRef.current.value = '';
              changeVariable(name, value, true);
            }
          }}>
          <img src="/add_primary.svg" alt="add-variable" loading="lazy" />
        </button>
      </section>
      {variablesArray.length > 0 ? (
        <section className={s.variablesTabsContainer}>
          {variablesArray.map(
            //https://github.com/facebook/react/issues/30745
            // eslint-disable-next-line react-compiler/react-compiler
            variable => {
              return (
                <div key={variable[0]} className={classNames(s.tab)}>
                  <button
                    type="button"
                    className={classNames(s.btn, s.btnLight, s.tabBtn)}
                    onClick={() => {
                      setVariableToForm(variable[0], variable[1]);
                    }}>
                    {variable[0]}: {variable[1]}
                  </button>

                  <button
                    type="button"
                    className={classNames(s.removeBtn, s.btn, s.btnPrimary)}
                    onClick={() => {
                      changeVariable(variable[0], variable[1], false);
                    }}>
                    <img src="/delete_white.svg" alt="delete-variable" loading="lazy" />
                  </button>
                </div>
              );
            },
          )}
        </section>
      ) : null}
    </div>
  );
}
