import { ActionFunctionArgs, redirect } from '@remix-run/node';
import _ from 'lodash';
import { sessionSignOut } from '~/firebase/session';

export async function loader() {
  return redirect('/');
}

export async function action({ request }: ActionFunctionArgs) {
  return sessionSignOut(request);
}
