import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUserSession } from '~/firebase/session';
import { IUser } from '../models/root';
import { MainPage } from '~/pages/main/main-page';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return null;
  }
  const user: IUser = {
    email: sessionUser.email ?? '',
    id: sessionUser.user_id ?? '',
    sessionExpireTime: sessionUser.exp * 1000,
  };

  return user;
}

export default function Index() {
  const data = useLoaderData<IUser | null>();
  return <MainPage user={data} />;
}
