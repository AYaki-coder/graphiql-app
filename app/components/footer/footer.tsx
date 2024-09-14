import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.footerContent}>
          <nav className={styles.linkContainer}>
            <a className={styles.ghLink} href="https://github.com/AV-Shell">
              <img className={styles.ghIcon} src="/github-mark.svg" alt="GitHub-logo" loading="lazy" />
              AV-Shell
            </a>
            <a className={styles.ghLink} href="https://github.com/users/AYaki-coder">
              <img className={styles.ghIcon} src="/github-mark.svg" alt="GitHub-logo" loading="lazy" />
              AYaki-coder
            </a>
            <a className={styles.ghLink} href="https://github.com/siviavio4ka">
              <img className={styles.ghIcon} src="/github-mark.svg" alt="GitHub-logo" loading="lazy" />
              siviavio4ka
            </a>
          </nav>
          <span className={styles.year}>2024</span>
          <a className={styles.logo} href="https://rs.school/courses/reactjs">
            <img src="/course-logo.svg" alt="RSS-logo" loading="lazy" />
          </a>
        </div>
      </div>
    </footer>
  );
}
