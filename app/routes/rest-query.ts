import { ActionFunctionArgs, json, redirect, TypedResponse } from '@remix-run/node';
import _ from 'lodash';
import { IApiResponse, IReq } from '~/models/rest';

export async function loader() {
  return redirect('/');
}

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<IApiResponse>> {
  const { req }: { req: IReq } = await request.json();

  const { url, headers, method, body } = req;
  try {
    const response = await fetch(url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify({ body }) } : {}),
    });

    const data = await response.json();
    return json({
      isError: false,
      errorText: '',
      status: response.status,
      statusText: response.statusText,
      response: data,
    });
  } catch (e) {
    const message = 'Something went wrong';
    const errorMessage = _.get(e, 'message');
    const causeMessage = _.get(e, 'cause.message');

    return json({
      isError: true,
      errorText: `${errorMessage ?? message}${causeMessage ? ', ' + causeMessage : ''}`,
      status: 0,
      statusText: '',
      response: null,
    });
  }
}
