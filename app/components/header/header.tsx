import { Link } from '@remix-run/react';
import { useContext } from 'react';
import { LangContext, LANGS } from '../lang-context/lang-context';
import classNames from 'classnames';
import styles from './header.module.scss';

export default function Header() {
  const langContext = useContext(LangContext);

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <div className={styles.headerContent}>
          <div>
            <Link className={classNames(styles.link, styles.logoText, styles.logoContainer)} to="/">
              <img className={styles.logo} src="/logo.svg" alt="logo" />
              GraphiQL
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
            <Link className={styles.link} to="/**">
              [Sign Out]
            </Link>
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
