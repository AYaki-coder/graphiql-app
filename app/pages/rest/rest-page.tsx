import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import classNames from 'classnames';
import { IApiResponse } from '~/models/rest';
import s from './rest-page.module.scss';
import { REST_VERBS } from '~/consts/restful.consts';
import _ from 'lodash';
import { HeadersSelector } from '~/components/headers-selector/headers-selector';
import { RestVariablesSelector } from '~/components/rest-variables-selector/rest-variables-selector';
import { TRestVariables } from '~/models/rest-variables-selector';
import { bodyObjToBase64, bodyParser, IBodyObj, stringToBase64, urlParser } from '~/utils/rest-helpers';
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
  const [result, setResult] = useState<IApiResponse | null>();
  const [headers, setHeaders] = useState<THeaders>({});
  const { langRecord } = useContext(LangContext);
  const params = useParams();
  const customNavigate = useCustomRestNavigate();
  const setHistoryRecord = useCreateHistoryRecord();
  const fullPath = params['*'] ?? '';
  const paramsArray: string[] = fullPath.split('/');
  const [method, urlBase64, bodyBase64] = paramsArray;
  const isGetMethod = method.toUpperCase() === REST_VERBS[0];
  const { url, urlParseError } = urlParser(urlBase64);
  const { bodyObj, bodyParseError } = bodyParser(bodyBase64, isGetMethod);

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
      const sendBody = method !== REST_VERBS[0] ? bodyBase64 : bodyObjToBase64(bodyObj);

      return customNavigate(newMethod, urlBase64, sendBody, { preventScrollReset: true });
    },

    [customNavigate, method, urlBase64, bodyBase64, bodyObj],
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

  const onSendClick = useCallback(async () => {
    let trBody = {};
    try {
      trBody = isGetMethod ? {} : { body: JSON.parse(bodyObj.body) };
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

    const query = {
      url,
      method,
      headers,
      ...(isGetMethod ? {} : { body: JSON.parse(bodyObj.body) }),
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
  }, [setResult, method, url, headers, isGetMethod, bodyObj]);

  return (
    <div className={s.wrapper}>
      <div className={s.page}>
        <h1>REST Client</h1>
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
        <div className={classNames(s.contentWrapper, s.bodyRow, { [s.hidden]: isGetMethod })}>
          <div className={s.bodySection}>
            <RestVariablesSelector
              className={s.cardView}
              showTitle={true}
              disabled={isGetMethod}
              onVariablesChange={onVariablesChange}
              variables={bodyObj.variables}
            />

            {isGetMethod ? (
              <textarea
                className={classNames(s.formControl, s.bodyEditor)}
                name="bodyEditor"
                placeholder={langRecord.restPage?.bodyEditorPlaceholder ?? ''}
                id=""
                onBlur={onBodyChange}
                value={bodyObj.body}
                disabled={isGetMethod}></textarea>
            ) : (
              <textarea
                className={classNames(s.formControl, s.bodyEditor)}
                name="bodyEditor"
                placeholder={langRecord.restPage?.bodyEditorPlaceholder ?? ''}
                id=""
                onBlur={onBodyChange}
                defaultValue={bodyObj.body}
                disabled={isGetMethod}></textarea>
            )}
          </div>
        </div>
        <div className={classNames(s.row, s.contentWrapper)}>
          <button className={classNames(s.submitButton, s.btn, s.btnPrimary)} onClick={onSendClick}>
            {langRecord.restPage?.requestButton ?? ''}
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
