import { Link } from '@remix-run/react';
import s from './main-page.module.scss';
import classNames from 'classnames';

export default function MainPage() {
  const isAuthorized = true;
  return (
    <>
      <section className={s.welcomeContainer}>
        <div className={s.wrapper}>
          <div className={classNames(s.display1, s.textWhite, s.welcomeBlock)}>
            {isAuthorized ? 'Welcome Back, [UserName]!' : 'Welcome!'}
          </div>
          <div className={s.buttonBlock}>
            {isAuthorized ? (
              <>
                <Link to="/get/">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>REST Client</button>
                </Link>
                <Link to="/graphql/">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>GraphiQL Client</button>
                </Link>
                <Link to="/history">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>History</button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>Sign In</button>
                </Link>
                <Link to="/signup">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
