import { useSearchParams } from '@remix-run/react';
import _ from 'lodash';
import { useCallback, useContext, useEffect, useRef } from 'react';
import s from './headers-selector.module.scss';
import { LangContext } from '../lang-context/lang-context';
import classNames from 'classnames';
import { useParamsParts } from '~/hooks/useParamsParts';
import { IHeadersSelectorProps, THeaders } from '~/models/headers-selector';

export function HeadersSelector(props: IHeadersSelectorProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { langRecord } = useContext(LangContext);

  const paramsArray = useParamsParts();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearchparams: THeaders = {};
  searchParams.forEach((value, key) => {
    currentSearchparams[key] = value;
  });

  const headersArray = Object.entries(currentSearchparams);

  const setHeader = useCallback(
    (name: string, value: string, isSet: boolean) => {
      let newHeaders: THeaders;
      if (isSet) {
        newHeaders = { ...currentSearchparams, [name.toLowerCase()]: value.toLowerCase() };
      } else {
        newHeaders = _.omit(currentSearchparams, [name.toLowerCase()]);
      }

      if (props.notifyOnChange) {
        props.onHeadersChange(newHeaders);
      }
      setSearchParams(newHeaders);
    },
    [currentSearchparams, setSearchParams],
  );

  const setHeaderToForm = useCallback(
    (name: string, value: string) => {
      if (nameRef && nameRef.current && valueRef && valueRef.current) {
        nameRef.current.value = name;
        valueRef.current.value = value;
      }
    },
    [nameRef, valueRef],
  );

  useEffect(() => {
    if (props.notifyOnInit) {
      props.onHeadersChange(currentSearchparams);
    }

    const isNewRequestPage = props.isGraphQl ? !paramsArray[0] : !paramsArray[1];

    if (props.addDefaultContentType && headersArray.length === 0 && isNewRequestPage) {
      setHeader('Content-Type', 'application/json', true);
    }
  }, []);

  return (
    <div className={classNames(s.headersContainer, props.className)} data-testid="headers-selector">
      {props.showTitle && (
        <h4 className={classNames(s.headersTitle, props.titleClassName)}>
          {langRecord.headersSelector?.titleText ?? ''}:
        </h4>
      )}

      <section className={classNames(s.fieldset, props.inputsClassName)}>
        <input
          type="text"
          className={classNames(s.headerInput, s.formControl)}
          placeholder={langRecord.headersSelector?.headerNameInputPlaceholder ?? ''}
          ref={nameRef}
        />
        <input
          type="text"
          className={classNames(s.headerInput, s.formControl)}
          placeholder={langRecord.headersSelector?.headerValueInputPlaceholder ?? ''}
          ref={valueRef}
        />
        <button
          type="button"
          className={classNames(s.btn, s.btnLight, s.addBtn)}
          onClick={event => {
            event.preventDefault();

            const name = nameRef.current?.value?.trim();
            const value = valueRef.current?.value?.trim();

            if (nameRef.current && valueRef.current && name && value) {
              nameRef.current.value = '';
              valueRef.current.value = '';
              setHeader(name, value, true);
            }
          }}>
          <img src="/add_primary.svg" alt="add-header" loading="lazy" />
        </button>
      </section>
      {headersArray.length > 0 ? (
        <section className={classNames(s.headersTabsContainer, props.tabsClassName)}>
          {headersArray.map(
            //https://github.com/facebook/react/issues/30745
            // eslint-disable-next-line react-compiler/react-compiler
            header => {
              return (
                <div key={header[0]} className={classNames(s.tab)}>
                  <button
                    type="button"
                    className={classNames(s.btn, s.btnLight, s.tabBtn)}
                    onClick={() => {
                      setHeaderToForm(header[0], header[1]);
                    }}>
                    {header[0]}: {header[1]}
                  </button>

                  <button
                    type="button"
                    className={classNames(s.removeBtn, s.btn, s.btnPrimary)}
                    onClick={() => {
                      setHeader(header[0], header[1], false);
                    }}>
                    <img src="/delete_white.svg" alt="delete-header" loading="lazy" />
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
