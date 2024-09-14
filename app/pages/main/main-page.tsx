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
      <div className={s.wrapper}>
        <section>
          <h2> Project</h2>
          <div className={s.twoColumn}>
            <div className={s.card}>
              <img src="/logo.png" alt="logo" />
            </div>

            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor ipsa cupiditate iste error sapiente ea?
              Quam eius autem repellat, esse ad beatae amet voluptates eaque consequatur commodi tempore facere earum?
            </p>
          </div>
          <Link className={classNames(s.btn, s.btnLg, s.btnPrimary)} to={'/'}>
            More Info
          </Link>
        </section>
        <section>
          <h2>Developers</h2>
          <div className={s.cardSection}>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <img className={s.cardImage} src="/i.webp" alt="cat" />
                <h4>Lorem ipsum dolor sit</h4>
              </div>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex adipisci fugiat repudiandae facilis beatae
                dignissimos voluptate quas incidunt expedita neque nemo quisquam, necessitatibus alias quasi quod vitae
                dolor sit obcaecati.
              </p>
              <Link className={classNames(s.btn, s.btnPrimary, s.cardBtn)} to={'/'}>
                <img className={s.btnIcon} src="/github-mark-white.svg" alt="github-icon" />
                GitHub
              </Link>
            </div>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <img className={s.cardImage} src="/i.webp" alt="cat" />
                <h4>Lorem ipsum dolor sit</h4>
              </div>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex adipisci fugiat repudiandae facilis beatae
                dignissimos voluptate quas incidunt expedita neque nemo quisquam, necessitatibus alias quasi quod vitae
                dolor sit obcaecati.
              </p>
              <Link className={classNames(s.btn, s.btnPrimary, s.cardBtn)} to={'/'}>
                <img className={s.btnIcon} src="/github-mark-white.svg" alt="github-icon" />
                GitHub
              </Link>
            </div>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <img className={s.cardImage} src="/i.webp" alt="cat" />
                <h4>Lorem ipsum dolor sit</h4>
              </div>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex adipisci fugiat repudiandae facilis beatae
                dignissimos voluptate quas incidunt expedita neque nemo quisquam, necessitatibus alias quasi quod vitae
                dolor sit obcaecati.
              </p>
              <Link className={classNames(s.btn, s.btnPrimary, s.cardBtn)} to={'/'}>
                <img className={s.btnIcon} src="/github-mark-white.svg" alt="github-icon" />
                GitHub
              </Link>
            </div>
          </div>
        </section>
        <section>
          <h2>Course</h2>
          <div className={s.twoColumn}>
            <img className={s.sectionImg} src="/react-logo.svg" alt="react-logo" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est ratione iste, nesciunt, aperiam sequi nisi
              consectetur temporibus earum deleniti quo dignissimos dicta praesentium nostrum aliquid, sit id veniam
              maiores suscipit.
            </p>
          </div>
          <Link className={classNames(s.btn, s.btnLg, s.btnPrimary)} to={'/'}>
            More Info
          </Link>
        </section>
      </div>
    </>
  );
}
