import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, Form, redirect } from '@remix-run/react';
import { firebaseSignIn } from '~/firebase/firebase';
import { createUserSession, getUserSession } from '~/firebase/session';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  console.log(sessionUser, 'sessionUser', sessionUser?.firebase.identities);
  if (sessionUser) {
    return redirect('/');
  }
  return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  const { user } = await firebaseSignIn(String(email ?? ''), String(password ?? ''));
  const token = await user.getIdToken();
  return createUserSession(token, '/');
};

export default function Login() {
  return (
    <div className="login">
      <h1>Login Page</h1>

      <Form method="post">
        <p>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" name="password" />
          </label>
        </p>

        <button type="submit">Login</button>
      </Form>

      <Link to="/signup">Create Account</Link>
    </div>
  );
}
