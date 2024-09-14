import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LangContext, LANGS } from '../lang-context/lang-context';
import classNames from 'classnames';
import styles from './header.module.scss';
import { IUser } from '~/models/root';
import _ from 'lodash';

export default function Header() {
  const langContext = useContext(LangContext);
  const navigate = useNavigate();
  const data = useLoaderData<IUser | null>();
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (data) {
      intervalId = setInterval(
        async () => {
          if (data.sessionExpireTime < Date.now() + 10 * 60 * 1000)
            try {
              await fetch('/signout-query', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              navigate('/signin', { replace: true });
            } catch (error) {
              console.log('signOutError', _.get(error, 'message', 'Something went wrong on logout'));
            }
        },
        5 * 60 * 1000,
      );
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate, data]);

  const onSignOutClick = useCallback(async () => {
    await fetch('/signout-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    navigate('/signin', { replace: true });
  }, [navigate]);

  // on render, set listener
  useEffect(() => {
    console.log('hello');
    window.addEventListener('scroll', changeSticky);
    return () => {
      window.removeEventListener('scroll', changeSticky);
    };
  }, []);

  const changeSticky = () => {
    /* Method that will fix header after a specific scrollable */
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop >= 250 ? true : false;
    setIsSticky(stickyClass);
    console.log(stickyClass);
  };

  return (
    <header className={classNames(styles.header, { [styles.isSticky]: isSticky })}>
      <div className={styles.wrapper}>
        <div className={styles.headerContent}>
          <div>
            <Link className={classNames(styles.link, styles.logoContainer)} to="/">
              <img className={styles.logo} src="/logo.svg" alt="logo" />
              <p className={classNames(styles.logoText)}>GraphiQL</p>
            </Link>
            <Link className={styles.link} to="/get/">
              [REST Client]
            </Link>
            <Link className={styles.link} to="/graphql/">
              [GraphiQL Client]
            </Link>
            <Link className={styles.link} to="/history">
              [History]
            </Link>
            <Link className={styles.link} to="/signin">
              [Sign In]
            </Link>
            <Link className={styles.link} to="/signup">
              [Sign up]
            </Link>

            <button onClick={onSignOutClick}>Sign Out</button>
          </div>

          <div className={styles.langContainer}>
            <button
              className={classNames(styles.btn, styles.langButton, {
                [styles.btnPrimary]: langContext?.langType === LANGS.en,
                [styles.selected]: langContext?.langType === LANGS.en,
                [styles.btnLight]: langContext?.langType !== LANGS.en,
              })}
              onClick={() => langContext?.changeLang(LANGS.en)}>
              En
            </button>
            <button
              className={classNames(styles.btn, styles.langButton, {
                [styles.btnPrimary]: langContext?.langType !== LANGS.en,
                [styles.selected]: langContext?.langType === LANGS.ru,
                [styles.btnLight]: langContext?.langType === LANGS.en,
              })}
              onClick={() => langContext?.changeLang(LANGS.ru)}>
              Ru
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
