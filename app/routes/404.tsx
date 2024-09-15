import { useContext } from 'react';
import s from '../styles/not-found.module.scss';
import { LangContext } from '~/components/lang-context/lang-context';

export default function NotFoundPage() {
  const { langRecord } = useContext(LangContext);
  return (
    <div className={s.page404}>
      <div className={s.h404}>404</div>
      <div>
        <h1 className={(s.display1, s.textWhite)}>{langRecord.page404.heading}</h1>
        <p>{langRecord.page404.text}</p>
      </div>
    </div>
  );
}
