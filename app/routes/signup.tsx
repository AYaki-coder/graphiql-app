import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, redirect } from '@remix-run/react';

import { firebaseSignUp } from '~/firebase/firebase';
import { createUserSession, getUserSession } from '~/firebase/session';
import s from '../styles/signin-signout.module.scss';
import classNames from 'classnames';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if (sessionUser) {
    return redirect('/');
  }
  return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  const { user } = await firebaseSignUp(String(email ?? ''), String(password ?? ''));
  const token = await user.getIdToken();
  return createUserSession(token, '/');
};

export default function SignUp() {
  return (
    <div className="signup">
      <h1>Sign Up Page</h1>

      <Form method="post">
        <p>
          <label>
            Email
            <input className={classNames(s.emailInput, s.formControl)} type="email" name="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input className={classNames(s.passwordInput, s.formControl)} type="password" name="password" />
          </label>
        </p>

        <button className={classNames(s.btnPrimary, s.btn)} type="submit">
          Sign Up
        </button>
      </Form>

      <Link to="/signin" className={classNames(s.btnLight, s.btn)}>
        Go to SignIn
      </Link>
    </div>
  );
}
