import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import _ from 'lodash';
import { Link, Form, redirect, json, useActionData, useNavigation } from '@remix-run/react';
import { firebaseSignIn } from '~/firebase/firebase';
import { createUserSession, getUserSession } from '~/firebase/session';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSubmit } from '@remix-run/react';
import { yupResolver } from '@hookform/resolvers/yup';
import s from '../styles/signin-signout.module.scss';
import classNames from 'classnames';
import { signSchema } from '~/utils/schema';
import { ISignValues } from '~/models/sing';
import { useRef } from 'react';

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
  try {
    const { user } = await firebaseSignIn(String(email ?? ''), String(password ?? ''));
    const token = await user.getIdToken();
    return createUserSession(token, '/');
  } catch (error) {
    return json({ error: `${_.get(error, 'message', '')}` });
  }
};

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const navigation = useNavigation();
  const { register, handleSubmit, formState } = useForm({
    mode: 'all',
    resolver: yupResolver(signSchema),
    defaultValues: {},
  });
  let errorMessage = '';
  const data = useActionData<typeof action>();
  if (data && data.error) {
    errorMessage = data.error;
  }

  const onSubmit: SubmitHandler<ISignValues> = async (data: ISignValues) => {
    try {
      if (formRef.current) {
        submit(formRef.current);
      }
    } catch (error) {
      console.log(_.get(error, 'message', ''));
    }
  };

  return (
    <div className="login">
      <h1>SignIn Page</h1>

      <Form
        method="post"
        ref={formRef}
        className={s.form}
        //https://github.com/facebook/react/issues/30745
        // eslint-disable-next-line react-compiler/react-compiler
        onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">
          Email: <span className={s.errorMessage}>{formState.errors.email?.message}</span>
        </label>
        <input
          className={classNames(s.emailInput, s.formControl)}
          type="text"
          id="email"
          {...register('email')}
          placeholder="Enter your email"
        />
        <label htmlFor="password">
          Password: <span className={s.errorMessage}>{formState.errors.password?.message}</span>
        </label>
        <input
          className={classNames(s.emailInput, s.formControl)}
          type="password"
          id="password"
          {...register('password')}
          placeholder="Enter your password"
        />
        <div
          className={classNames(s.backendErrorMessage, {
            [s.hidden]: !errorMessage || navigation.state === 'submitting',
          })}>
          <span className={s.errorMessage}>{errorMessage}</span>
        </div>

        <div className={s.buttonsContainer}>
          <button
            type="submit"
            className={classNames(s.btnPrimary, s.btn)}
            disabled={!formState.isValid || navigation.state !== 'idle'}>
            Login
          </button>

          <Link to="/signup" className={classNames(s.btnLight, s.btn)}>
            Go to Registration
          </Link>
        </div>
      </Form>
    </div>
  );
}
