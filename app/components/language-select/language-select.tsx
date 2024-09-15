import { useContext, useState } from 'react';
import { LangContext, LANGS } from '../lang-context/lang-context';
import s from './language-select.module.scss';
import classNames from 'classnames';

export default function LanguageSelect() {
  const langContext = useContext(LangContext);
  const [isActive, setIsActive] = useState<boolean>(false);

  const onChange = (event: React.SyntheticEvent<HTMLElement>): void => {
    const member = (event.target as HTMLElement).innerText === LANGS.en ? LANGS.en : LANGS.ru;
    langContext?.changeLang(member);
  };

  return (
    <div className={classNames(s.langSelect, { [s.isActive]: isActive })} onClick={() => setIsActive(a => !a)}>
      <img className={s.image} src={langContext.langType === LANGS.en ? '/flag-en.svg' : '/flag-ru.svg'} alt="flag" />
      <span className={s.currentLang}>{langContext.langType === LANGS.en ? LANGS.en : LANGS.ru}</span>

      <i className={classNames('bi', 'bi-chevron-down', { [s.rotate]: isActive })} />
      <div className={s.langDropdown}>
        <div className={s.langOption} onClick={onChange}>
          <img
            className={s.image}
            src={langContext.langType !== LANGS.en ? '/flag-en.svg' : '/flag-ru.svg'}
            alt="flag"
          />
          {langContext.langType !== LANGS.en ? LANGS.en : LANGS.ru}
        </div>
      </div>
    </div>
  );
}
