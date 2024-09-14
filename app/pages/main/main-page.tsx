import { Link } from '@remix-run/react';
import s from './main-page.module.scss';
import classNames from 'classnames';
import { useContext } from 'react';
import { LangContext } from '~/components/lang-context/lang-context';

export default function MainPage() {
  const isAuthorized = true;
  const { langRecord } = useContext(LangContext);
  return (
    <>
      <section className={s.welcomeContainer} data-testid="mainpage-section">
        <div className={s.wrapper}>
          <div className={classNames(s.display1, s.textWhite, s.welcomeBlock)}>
            {isAuthorized ? `${langRecord.mainPage.welcome_back}, [UserName]!` : `${langRecord.mainPage.welcome}!`}
          </div>
          <div className={s.buttonBlock}>
            {isAuthorized ? (
              <>
                <Link to="/get/">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>
                    {langRecord.mainPage.rest_client}
                  </button>
                </Link>
                <Link to="/graphql/">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>
                    {langRecord.mainPage.graph_client}
                  </button>
                </Link>
                <Link to="/history">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>
                    {langRecord.mainPage.history}
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>
                    {langRecord.mainPage.sign_in}
                  </button>
                </Link>
                <Link to="/signup">
                  <button className={classNames(s.btn, s.btnLg, s.btnSuccess, s.btnLink)}>
                    {langRecord.mainPage.sign_up}
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      <div className={s.wrapper}>
        <section>
          <h2>{langRecord.mainPage.project}</h2>
          <div className={s.projectContainer}>
            <div className={classNames(s.card, s.projectText)}>
              <p>{langRecord.mainPage.project_text1}</p>
            </div>
            <div className={classNames(s.card, s.projectText1)}>
              <p>{langRecord.mainPage.project_text2}</p>
            </div>
            <div className={classNames(s.card, s.cardPrimary, s.logo, s.logoText)}>
              <img className={s.logoIcon} src="/logo.svg" alt="logo" />
              GraphiQL
            </div>
            <div className={classNames(s.card, s.cardInfo, s.feature1)}>
              <h4>{langRecord.mainPage.project_feature1_title}</h4>
              <p>{langRecord.mainPage.project_feature1_text}</p>
            </div>
            <div className={classNames(s.card, s.cardInfo, s.feature2)}>
              <h4>{langRecord.mainPage.project_feature2_title}</h4>
              <p>{langRecord.mainPage.project_feature2_text}</p>
            </div>
            <div className={classNames(s.card, s.cardInfo, s.feature3)}>
              <h4>{langRecord.mainPage.project_feature3_title}</h4>
              <p>{langRecord.mainPage.project_feature3_text}</p>
            </div>
            <div className={classNames(s.card, s.cardInfo, s.feature4)}>
              <h4>{langRecord.mainPage.project_feature4_title}</h4>
              <p>{langRecord.mainPage.project_feature4_text}</p>
            </div>
          </div>
          <Link
            className={classNames(s.btn, s.btnLg, s.btnPrimary)}
            to={'https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md'}>
            {langRecord.mainPage.more_info}
          </Link>
        </section>
        <section>
          <h2>{langRecord.mainPage.developers}</h2>
          <div className={s.cardSection}>
            <div className={classNames(s.card, s.cardSpaceBw)}>
              <div>
                <div className={s.cardHeader}>
                  <img className={s.cardImage} src="/ava-vit.jpg" alt="cat" />
                  <div>
                    <h4>{langRecord.mainPage.developer1_name}</h4>
                    <h4 className={s.textSecondary}>@AV-Shell</h4>
                  </div>
                </div>
                <p>{langRecord.mainPage.developer1_text}</p>
              </div>
              <Link className={classNames(s.btn, s.btnPrimary, s.cardBtn)} to={'https://github.com/AV-Shell'}>
                <img className={s.btnIcon} src="/github-mark-white.svg" alt="github-icon" />
                GitHub
              </Link>
            </div>
            <div className={classNames(s.card, s.cardSpaceBw)}>
              <div>
                <div className={s.cardHeader}>
                  <img className={s.cardImage} src="/ava-lena.jpg" alt="cat" />
                  <div>
                    <h4>{langRecord.mainPage.developer2_name}</h4>
                    <h4 className={s.textSecondary}>@AYaki-coder</h4>
                  </div>
                </div>
                <p>{langRecord.mainPage.developer2_text}</p>
              </div>
              <Link className={classNames(s.btn, s.btnPrimary, s.cardBtn)} to={'https://github.com/AYaki-coder'}>
                <img className={s.btnIcon} src="/github-mark-white.svg" alt="github-icon" />
                GitHub
              </Link>
            </div>
            <div className={classNames(s.card, s.cardSpaceBw)}>
              <div>
                <div className={s.cardHeader}>
                  <img className={s.cardImage} src="/ava-slava.jpg" alt="cat" />
                  <div>
                    <h4>{langRecord.mainPage.developer3_name}</h4>
                    <h4 className={s.textSecondary}>@siviavio4ka</h4>
                  </div>
                </div>
                <p>{langRecord.mainPage.developer3_text}</p>
              </div>
              <Link className={classNames(s.btn, s.btnPrimary, s.cardBtn)} to={'https://github.com/siviavio4ka'}>
                <img className={s.btnIcon} src="/github-mark-white.svg" alt="github-icon" />
                GitHub
              </Link>
            </div>
          </div>
        </section>
        <section>
          <h2>{langRecord.mainPage.course}</h2>
          <div className={s.twoColumn}>
            <img className={s.sectionImg} src="/react-logo.svg" alt="react-logo" />
            <div>
              <p className={s.sectionText}>{langRecord.mainPage.course_text1}</p>
              <p className={s.sectionText}>{langRecord.mainPage.course_text2}</p>
              <p className={s.sectionText}>{langRecord.mainPage.course_text3}</p>
              <p className={s.sectionText}>{langRecord.mainPage.course_text4}</p>
            </div>
          </div>
          <Link className={classNames(s.btn, s.btnLg, s.btnPrimary)} to={'https://rs.school/courses/reactjs'}>
            {langRecord.mainPage.more_info}
          </Link>
        </section>
      </div>
    </>
  );
}
