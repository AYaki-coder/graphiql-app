import { DocExplorer, GraphiQLProvider } from '@graphiql/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { Form, json, redirect, useActionData, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { useContext, useState } from 'react';
import { ActionFunctionArgs } from 'react-router-dom';
import { HeadersSelector } from '~/components/headers-selector/headers-selector';
import { LangContext } from '~/components/lang-context/lang-context';
import ResponseView from '~/components/response/responseView';
import { THeaders } from '~/models/headers-selector';
import { ResponseViewType } from '~/models/response';
import { formatGraphQL } from '~/utils/formatterGraphQL';
import { LoaderFunctionArgs } from '@remix-run/node';
import { encode, decode } from 'js-base64';
import s from '../styles/graphql.module.scss';
import '@graphiql/react/dist/style.css';
import classNames from 'classnames';
import { getUserSession } from '~/firebase/session';
import { CLIENT_TYPE, historyService } from '~/utils/history-service';

export function shouldRevalidate() {
  return false;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect('/signin');
  }

  const { endpoint, body } = params;

  let decodedEndpoint = '';
  let decodedBody = null;
  try {
    decodedEndpoint = endpoint ? decode(endpoint) : '';
    decodedBody = body ? JSON.parse(decode(body)) : null;
  } catch (error) {
    //TODO: add modal window
  }

  const url = new URL(request.url);
  const headers = Object.fromEntries(url.searchParams.entries());

  return json({
    endpointUrlLoader: decodedEndpoint,
    queryLoader: decodedBody?.query || '',
    variablesLoader: decodedBody?.variables || '',
    headersLoader: headers,
    userEmail: sessionUser.email ?? '',
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const endpointUrl = formData.get('endpointUrl') as string;
  const query = formData.get('query') as string;
  const variables = formData.get('variables') as string | '';
  const headers = JSON.parse((formData.get('headers') as string) || '[]');
  const sdlUrl = formData.get('sdlUrl') as string;

  let requestBody;

  if (variables) {
    try {
      requestBody = { query, variables: JSON.parse(variables) };
    } catch (error) {
      return json({ status: 400, data: { error: 'Invalid JSON in variables' } });
    }
  } else {
    requestBody = { query };
  }

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      ...Object.entries(headers).reduce((acc: Record<string, string>, [key, value]) => {
        acc[key] = value as string;
        return acc;
      }, {}),
    },
    body: JSON.stringify(requestBody),
  };

  let response;
  let data;

  try {
    response = await fetch(endpointUrl, fetchOptions);
    data = await response.json();
  } catch (error) {
    return json({ status: 400, data: { error: 'Failed to fetch data' } });
  }

  return json({
    status: response.status,
    data,
  });
}

export default function GraphQL() {
  const { endpointUrlLoader, queryLoader, variablesLoader, headersLoader, userEmail } = useLoaderData<{
    endpointUrlLoader: string;
    queryLoader: string;
    variablesLoader: string;
    headersLoader: Record<string, string>;
    userEmail: string;
  }>();

  const [endpointUrl, setEndpointUrl] = useState(endpointUrlLoader);
  const [sdlUrl, setSdlUrl] = useState('');
  const [query, setQuery] = useState(queryLoader);
  const [variables, setVariables] = useState(variablesLoader);
  const [headers, setHeaders] = useState<THeaders>(headersLoader ?? {});
  const response = useActionData<{ status: number; data: unknown }>() ?? { status: 0, data: {} };
  const { langRecord } = useContext(LangContext);
  const navigate = useNavigate();

  const updateUrl = (isNavigate: boolean = true) => {
    if (!endpointUrl) {
      return;
    }
    const encodedEndpointUrl = encode(endpointUrl);
    const encodedBody = encode(
      JSON.stringify({
        query,
        variables,
      }),
    );

    let newUrl = `/graphql/${encodedEndpointUrl}/${encodedBody}`;

    const queryParams = new URLSearchParams();
    Object.entries(headers).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    if (queryParams.toString()) {
      newUrl += `?${queryParams.toString()}`;
    }

    if (isNavigate) {
      navigate(newUrl, { replace: true });
    }

    return newUrl;
  };

  const handleHeadersChange = (newHeaders: Record<string, string>) => {
    setHeaders(newHeaders);
  };

  const handlePrettierClick = () => {
    setQuery(formatGraphQL(query));
  };

  let fetcher = null;
  if (typeof window !== 'undefined' && (sdlUrl || endpointUrl)) {
    try {
      fetcher = createGraphiQLFetcher({
        url: sdlUrl || `${endpointUrl}?sdl`,
      });
    } catch (error) {
      //TODO: add modal window
    }
  }

  const handleSubmit = () => {
    historyService.setItem(userEmail, {
      client: CLIENT_TYPE.graph,
      viewLink: `GRAPHQL ${endpointUrl}`,
      fullLink: updateUrl(false) ?? '',
    });
  };

  return (
    <div className={s.wrapper}>
      <div className={s.page}>
        <h1>{langRecord.graphqlPage?.titleText ?? ''}</h1>
        <Form method="post" onSubmit={handleSubmit}>
          <div className={classNames(s.formField)}>
            <label>
              {langRecord.graphqlPage?.endpointUrlLabel ?? ''}:
              <input
                type="text"
                value={endpointUrl}
                className={classNames(s.formControl, s.full)}
                onChange={e => {
                  updateUrl(true);
                  setEndpointUrl(e.target.value);
                }}
                name="endpointUrl"
                required
              />
            </label>
          </div>
          <div className={classNames(s.formField)}>
            <label>
              {langRecord.graphqlPage?.sdlUrlLabel ?? ''}:
              <input
                type="text"
                value={sdlUrl || `${endpointUrl}?sdl`}
                className={classNames(s.formControl, s.full)}
                onChange={e => setSdlUrl(e.target.value)}
                name="sdlUrl"
              />
            </label>
          </div>
          <div className={classNames(s.row, s.formField)}>
            <HeadersSelector
              addDefaultContentType={true}
              notifyOnInit={false}
              notifyOnChange={true}
              showTitle={true}
              onHeadersChange={handleHeadersChange}
              isGraphQl={true}
            />
          </div>
          <div className={classNames(s.flex, s.textArea)}>
            <div className={classNames(s.textAreaWithButton)}>
              <label>
                {langRecord.graphqlPage?.queryLabel ?? ''}:
                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className={classNames(s.formControl)}
                  name="query"
                  onBlur={() => updateUrl(true)}
                  rows={10}
                  required
                />
              </label>
              <button
                type="button"
                className={classNames(s.submitButton, s.btn, s.btnOutlinePrimary, s.btnLg)}
                onClick={handlePrettierClick}>
                {langRecord.graphqlPage?.prettierButton ?? ''}
              </button>
            </div>
            <div>
              <label>
                {langRecord.graphqlPage?.variablesLabel ?? ''}:
                <textarea
                  value={variables}
                  className={classNames(s.formControl)}
                  onChange={e => setVariables(e.target.value)}
                  name="variables"
                  rows={10}
                />
              </label>
            </div>
          </div>

          <input type="hidden" name="headers" value={JSON.stringify(headers)} />

          <button type="submit" className={classNames(s.submitButton, s.btn, s.btnPrimary, s.btnLg)}>
            {langRecord.graphqlPage?.sendQueryButton ?? ''}
          </button>
        </Form>

        <div className={classNames(s.responseWrapper)}>
          <ResponseView data={response.data} status={response.status} type={ResponseViewType.JSON} />
        </div>

        {fetcher && (
          <div className={classNames(s.cardView)}>
            <h2>{langRecord.graphqlPage?.documentationLabel ?? ''}</h2>
            <GraphiQLProvider fetcher={fetcher}>
              <div className={classNames('graphiql-container', s.textPrimary)}>
                <DocExplorer />
              </div>
            </GraphiQLProvider>
          </div>
        )}
      </div>
    </div>
  );
}
