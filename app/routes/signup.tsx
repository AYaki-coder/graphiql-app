import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, Link, redirect, useActionData, useNavigation, useSubmit } from '@remix-run/react';
import _ from 'lodash';
import { firebaseSignUp } from '~/firebase/firebase';
import { createUserSession, getUserSession } from '~/firebase/session';
import s from '../styles/signin-signout.module.scss';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ISignValues } from '~/models/sing';
import { signSchema } from '~/utils/schema';
import { useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

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
    const { user } = await firebaseSignUp(String(email ?? ''), String(password ?? ''));
    const token = await user.getIdToken();
    return createUserSession(token, '/');
  } catch (error) {
    return json({ error: `${_.get(error, 'message', '')}` });
  }
};

export default function SignUp() {
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
      //
    }
  };

  return (
    <div className="signup">
      <h1>Sign Up Page</h1>

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
            Register
          </button>

          <Link to="/signin" className={classNames(s.btnLight, s.btn)}>
            Go to Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
