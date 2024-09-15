import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LangContext } from '../lang-context/lang-context';
import classNames from 'classnames';
import styles from './header.module.scss';
import { IUser } from '~/models/root';
import _ from 'lodash';
import LanguageSelect from '../language-select/language-select';

export default function Header() {
  const { langRecord } = useContext(LangContext);
  const navigate = useNavigate();
  const data = useLoaderData<IUser | null>();
  const isAuthorized = data !== null;
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
              navigate('/', { replace: true });
            } catch (error) {
              //TODO: add modal window
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
    navigate('/', { replace: true });
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('scroll', changeSticky);
    return () => {
      window.removeEventListener('scroll', changeSticky);
    };
  }, []);

  const changeSticky = () => {
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop >= 50 ? true : false;
    setIsSticky(stickyClass);
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
          </div>

          <div className={styles.flex}>
            <div className={styles.langContainer}>
              <LanguageSelect />
            </div>

            <div className={styles.actionContainer}>
              {isAuthorized ? (
                <button
                  className={classNames(styles.btn, { [styles.btnSuccess]: isSticky, [styles.btnLight]: !isSticky })}
                  onClick={onSignOutClick}>
                  {langRecord.mainPage.sign_out}
                </button>
              ) : (
                <>
                  <Link
                    className={classNames(styles.btn, {
                      [styles.btnOutlineSuccess]: isSticky,
                      [styles.btnOutlineLight]: !isSticky,
                    })}
                    to="/signin">
                    {langRecord.mainPage.sign_in}
                  </Link>
                  <Link
                    className={classNames(styles.btn, { [styles.btnSuccess]: isSticky, [styles.btnLight]: !isSticky })}
                    to="/signup">
                    {langRecord.mainPage.sign_up}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
