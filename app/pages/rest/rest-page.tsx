import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from '@remix-run/react';
import classNames from 'classnames';
import { IApiResponse } from '~/models/rest';
import s from './rest-page.module.scss';
import { REST_VERBS } from '~/consts/restful.consts';
import _ from 'lodash';
import { HeadersSelector } from '~/components/headers-selector/headers-selector';
import { RestVariablesSelector } from '~/components/rest-variables-selector/rest-variables-selector';
import { TRestVariables } from '~/models/rest-variables-selector';
import {
  bodyObjToBase64,
  bodyParser,
  IBodyObj,
  isJsonBody,
  isMethodWithoutBodyFunc,
  prepareBodyToSend,
  prettifyBody,
  stringToBase64,
  urlParser,
} from '~/utils/rest-helpers';
import ResponseView from '~/components/response/responseView';
import { ResponseViewType } from '~/models/response';
import { LangContext } from '~/components/lang-context/lang-context';
import { useCustomRestNavigate } from '~/hooks/useCustomRestNavigate';
import { THeaders } from '~/models/headers-selector';
import { CLIENT_TYPE } from '~/utils/history-service';
import { IUser } from '~/models/root';
import { useCreateHistoryRecord } from '~/hooks/useCreateHistoryRecord';

interface IRestPageProps {
  user: IUser;
}

export function RestPage({ user }: IRestPageProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [result, setResult] = useState<IApiResponse | null>();
  const [headers, setHeaders] = useState<THeaders>({});
  const { langRecord } = useContext(LangContext);
  const params = useParams();
  const customNavigate = useCustomRestNavigate();
  const setHistoryRecord = useCreateHistoryRecord();
  const fullPath = params['*'] ?? '';
  const paramsArray: string[] = fullPath.split('/');
  const [method, urlBase64, bodyBase64] = paramsArray;
  const isMethodWithoutBody = isMethodWithoutBodyFunc(method);
  const isBodyJson = isJsonBody(headers);
  const { url, urlParseError } = urlParser(urlBase64);
  const { bodyObj, bodyParseError } = bodyParser(bodyBase64, isMethodWithoutBody);
  const [bodyFormatError, setBodyFormatError] = useState('');

  useEffect(() => {
    const sendUrl = urlParseError === null ? urlBase64 : stringToBase64(url);
    const sendBody = bodyParseError === null ? bodyBase64 : bodyObjToBase64(bodyObj);

    if (urlParseError || bodyParseError) {
      customNavigate(method, sendUrl, sendBody, { preventScrollReset: true });
    }
  }, []);

  const onMethodChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newMethod = event.target.value;
      const sendBody = !isMethodWithoutBody ? bodyBase64 : bodyObjToBase64(bodyObj);

      return customNavigate(newMethod, urlBase64, sendBody, { preventScrollReset: true });
    },

    [customNavigate, isMethodWithoutBody, urlBase64, bodyBase64, bodyObj],
  );

  const onUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newUrlBase64 = stringToBase64(event.target.value);
      return customNavigate(method, newUrlBase64, bodyBase64);
    },
    [customNavigate, method, bodyBase64],
  );

  const onVariablesChange = useCallback(
    (variables: TRestVariables) => {
      const newBodyObject: IBodyObj = {
        body: bodyObj.body,
        variables,
      };
      const newBodyBase64 = bodyObjToBase64(newBodyObject);

      return customNavigate(method, urlBase64, newBodyBase64, { preventScrollReset: true });
    },
    [customNavigate, method, urlBase64, bodyObj],
  );

  const onBodyChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newBody = event.target.value ?? '';
      const newBodyObject: IBodyObj = {
        body: newBody,
        variables: bodyObj.variables,
      };
      const newBodyBase64 = bodyObjToBase64(newBodyObject);

      return customNavigate(method, urlBase64, newBodyBase64, { preventScrollReset: true });
    },
    [customNavigate, method, urlBase64, bodyObj],
  );

  const prettifyClick = () => {
    const { newBody, errorMessage } = prettifyBody(bodyObj);
    if (errorMessage) {
      return setBodyFormatError(errorMessage);
    }
    setBodyFormatError('');
    if (bodyRef.current) {
      bodyRef.current.value = newBody;
    }

    const newBodyObject: IBodyObj = {
      body: newBody,
      variables: bodyObj.variables,
    };
    const newBodyBase64 = bodyObjToBase64(newBodyObject);
    return customNavigate(method, urlBase64, newBodyBase64, { preventScrollReset: true });
  };

  const onSendClick = useCallback(async () => {
    try {
      const trBody = isMethodWithoutBody ? {} : { body: prepareBodyToSend(bodyObj, isBodyJson) };

      const query = {
        url,
        method,
        headers,
        ...trBody,
      };

      setHistoryRecord(CLIENT_TYPE.rest, user.email, method, url, urlBase64, bodyBase64);

      const response: Response = await fetch('/rest-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ req: query }),
      });

      const data: IApiResponse = await response.json();
      setResult(data);
    } catch (error) {
      const message = _.get(error, 'message', 'Something went wrong in json body');

      setResult({
        isError: true,
        errorText: message,
        status: 0,
        statusText: '',
        response: null,
      });
      return;
    }
  }, [setResult, method, url, headers, isMethodWithoutBody, bodyObj]);

  return (
    <div className={s.wrapper}>
      <div className={s.page}>
        <h1>{langRecord.restPage?.title ?? ''}</h1>
        <div className={classNames(s.row)}>
          <select
            name="method"
            className={classNames(s.formControl, s.method)}
            id="method"
            onChange={onMethodChange}
            value={method.toUpperCase()}>
            {REST_VERBS.map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <input
            type="text"
            id="url"
            autoComplete="off"
            className={classNames(s.formControl, s.url)}
            value={url}
            onChange={onUrlChange}
          />
        </div>
        <div className={classNames(s.row, s.contentWrapper)}>
          <HeadersSelector
            className={s.cardView}
            addDefaultContentType={true}
            showTitle={true}
            notifyOnChange={true}
            notifyOnInit={true}
            onHeadersChange={h => setHeaders(h)}
          />
        </div>
        <div className={classNames(s.contentWrapper, s.bodyRow, { [s.hidden]: isMethodWithoutBody })}>
          <div className={s.bodySection}>
            <RestVariablesSelector
              className={s.cardView}
              showTitle={true}
              disabled={isMethodWithoutBody}
              onVariablesChange={onVariablesChange}
              variables={bodyObj.variables}
            />

            {isMethodWithoutBody ? (
              <textarea
                className={classNames(s.formControl, s.bodyEditor)}
                name="bodyEditor"
                placeholder={langRecord.restPage?.bodyEditorPlaceholder ?? ''}
                id=""
                onBlur={onBodyChange}
                value={bodyObj.body}
                disabled={isMethodWithoutBody}></textarea>
            ) : (
              <textarea
                className={classNames(s.formControl, s.bodyEditor)}
                name="bodyEditor"
                placeholder={langRecord.restPage?.bodyEditorPlaceholder ?? ''}
                id=""
                onBlur={onBodyChange}
                ref={bodyRef}
                defaultValue={bodyObj.body}
                disabled={isMethodWithoutBody}></textarea>
            )}
          </div>
        </div>
        {bodyFormatError && (
          <div className={classNames(s.row, s.contentWrapper)}>
            <span className={classNames(s.errorMessage)}>
              {langRecord.restPage?.bodyFormatError ?? ''} {bodyFormatError}
            </span>
          </div>
        )}
        <div className={classNames(s.row, s.contentWrapper, s.bodyControls)}>
          <button className={classNames(s.submitButton, s.btn, s.btnPrimary)} onClick={onSendClick}>
            {langRecord.restPage?.requestButton ?? ''}
          </button>
          <button
            className={classNames(s.prettifyButton, s.btn, s.btnPrimary)}
            onClick={prettifyClick}
            disabled={!isBodyJson}>
            {langRecord.restPage?.prettifyButton ?? ''}
          </button>
        </div>
        <div className={classNames(s.contentWrapper)}>
          <div className={classNames(s.resultContainer, s.cardView)}>
            {!!result && (
              <ResponseView
                data={result.isError ? result.errorText : result.response}
                status={result.status}
                type={result.isError ? ResponseViewType.TEXT : ResponseViewType.JSON}></ResponseView>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
