import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, Link, redirect, useActionData, useNavigation, useSubmit } from '@remix-run/react';
import _ from 'lodash';
import { firebaseSignUp } from '~/firebase/firebase';
import { createUserSession, getUserSession } from '~/firebase/session';
import s from '../styles/signin-signout.module.scss';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ISignValues } from '~/models/sing';
import { signSchema, signSchemaRu } from '~/utils/schema';
import { useContext, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LangContext, LANGS } from '~/components/lang-context/lang-context';

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
  const { langRecord, langType } = useContext(LangContext);
  const schema = langType === LANGS.en ? signSchema : signSchemaRu;
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const navigation = useNavigation();
  const { register, handleSubmit, formState } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
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
      //TODO: add modal window
    }
  };

  return (
    <div className={s.wrapper} data-testid="sign-up">
      <div className={classNames(s.page)}>
        <h1>{langRecord.sign_in_up.sign_up}</h1>

        <div className={classNames(s.card, s.width, s.alignSelfCenter)}>
          <div className={classNames(s.header)}>
            <h4>{langRecord.sign_in_up.sign_up_greeting}</h4>
            <p className={s.textSecondary}>{langRecord.sign_in_up.sign_up_greeting_secondary}</p>
          </div>
          <Form
            method="post"
            ref={formRef}
            className={s.form}
            //https://github.com/facebook/react/issues/30745
            // eslint-disable-next-line react-compiler/react-compiler
            onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">
              {langRecord.sign_in_up.email}: <span className={s.errorMessage}>{formState.errors.email?.message}</span>
            </label>
            <input
              className={classNames(s.emailInput, s.formControl, s.full)}
              type="text"
              id="email"
              {...register('email')}
              placeholder={langRecord.sign_in_up.email_placeholder}
            />
            <label htmlFor="password">
              {langRecord.sign_in_up.password}:{' '}
              <span className={s.errorMessage}>{formState.errors.password?.message}</span>
            </label>
            <input
              className={classNames(s.emailInput, s.formControl, s.full)}
              type="password"
              id="password"
              {...register('password')}
              placeholder={langRecord.sign_in_up.password_placeholder}
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
                className={classNames(s.btnPrimary, s.btn, s.btnLg)}
                disabled={!formState.isValid || navigation.state !== 'idle'}>
                {langRecord.sign_in_up.register}
              </button>

              <Link to="/signin" className={classNames(s.btnOutlinePrimary, s.btn, s.btnLg)}>
                {langRecord.sign_in_up.to_login}
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
