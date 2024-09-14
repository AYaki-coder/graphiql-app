import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, Form, redirect } from '@remix-run/react';
import { firebaseSignIn } from '~/firebase/firebase';
import { createUserSession, getUserSession } from '~/firebase/session';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect('/signin');
  }
  return null;
}

export default function History() {
  return (
    <div className="history">
      <h1>History Page</h1>
    </div>
  );
}
