import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { LangContext, LANGS } from '../lang-context/lang-context';
import classNames from 'classnames';
import styles from './header.module.scss';
import { IUser } from '~/models/root';
import _ from 'lodash';

export default function Header() {
  const langContext = useContext(LangContext);
  const navigate = useNavigate();
  const data = useLoaderData<IUser | null>();

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

  return (
    <header className={styles.header}>
      <Link className={styles.link} to="/">
        [Main Page]
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
      {/* <Link className={styles.link} to="/signout">
        [Sign Out]
      </Link> */}
      <button onClick={onSignOutClick}>Sign Out</button>

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
    </header>
  );
}
