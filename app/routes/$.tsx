import { LoaderFunctionArgs } from '@remix-run/node';
import type { Params, ShouldRevalidateFunction } from '@remix-run/react';
import { useLoaderData, redirect } from '@remix-run/react';
import { REST_VERBS } from '~/consts/restful.consts';
import { getUserSession } from '~/firebase/session';
import { IUser } from '~/models/root';
import { RestPage } from '~/pages/rest/rest-page';

function isRestRoutes(params: Params<string>) {
  const fullPath = params['*'] ?? '';
  const redirectUrl = '/';

  const paramsArray: string[] = fullPath.split('/');
  const [method, base64Url, base64body] = paramsArray;
  if (!REST_VERBS.some(verb => method.toUpperCase() === verb)) {
    return false;
  } else if (
    (paramsArray.length === 2 && paramsArray[0].toLowerCase() === 'get') ||
    (paramsArray.length === 3 && paramsArray[0].toLowerCase() !== 'get')
  ) {
    return true;
  }

  return false;
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ nextParams }) => {
  return !isRestRoutes(nextParams);
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const redirectUrl = '/404';

  if (isRestRoutes(params)) {
    const sessionUser = await getUserSession(request);
    if (!sessionUser) {
      return redirect('/signin');
    }

    const user: IUser = {
      email: sessionUser.email ?? '',
      id: sessionUser.user_id ?? '',
      sessionExpireTime: sessionUser.exp * 1000,
    };

    return user;
  }

  throw redirect(redirectUrl);
}

export default function Rest() {
  const data = useLoaderData<IUser>();
  return <RestPage user={data} />;
}
