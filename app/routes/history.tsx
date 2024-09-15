import { LoaderFunctionArgs } from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { getUserSession } from '~/firebase/session';
import { IUser } from '../models/root';
import { HistoryPage } from '~/pages/history/history-page';

export async function loader({ request }: LoaderFunctionArgs) {
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

export default function History() {
  const data = useLoaderData<IUser>();
  return <HistoryPage user={data} />;
}
