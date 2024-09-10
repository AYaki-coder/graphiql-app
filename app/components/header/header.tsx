import { Link } from '@remix-run/react';
import styles from './header.module.scss';

export default function Header() {
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
      <Link className={styles.link} to="/**">
        [Sign Out]
      </Link>

      <button>En</button>
      <button>Ru</button>
    </header>
  );
}
