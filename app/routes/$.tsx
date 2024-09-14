import { LoaderFunctionArgs } from '@remix-run/node';
import { useParams, useNavigate, useLoaderData, redirect } from '@remix-run/react';
import { REST_VERBS } from '~/consts/restful.consts';
import RestPage from '~/pages/rest/rest-page';

export function shouldRevalidate() {
  return false;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const fullPath = params['*'] ?? '';
  const redirectUrl = '/';

  const paramsArray: string[] = fullPath.split('/');
  const [method, base64Url, base64body] = paramsArray;
  if (!REST_VERBS.some(verb => method.toUpperCase() === verb)) {
    throw redirect(redirectUrl);
  } else if (paramsArray.length === 2 && paramsArray[0].toLowerCase() === 'get') {
    return [method, base64Url, undefined];
  } else if (paramsArray.length === 3 && paramsArray[0].toLowerCase() !== 'get') {
    return [method, base64Url, base64body];
  }

  throw redirect(redirectUrl);
}

export default function Rest() {
  return <RestPage></RestPage>;
}
