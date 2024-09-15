import { Link } from '@remix-run/react';
import s from './history-page.module.scss';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { LangContext } from '~/components/lang-context/lang-context';
import { IUser } from '~/models/root';
import { historyService, IHistoryItem } from '~/utils/history-service';

interface IHistoryPageProps {
  user: IUser;
}

export function HistoryPage({ user }: IHistoryPageProps) {
  const { langRecord } = useContext(LangContext);
  const [historyRecords, setHistoryRecords] = useState<IHistoryItem[]>([]);

  useEffect(() => {
    setHistoryRecords(historyService.getItems(user.email ?? 'anonymous'));
  }, []);

  return (
    <>
      <div className={s.wrapper} data-testid="history-page">
        <section>
          <h2>History Page</h2>
          {historyRecords.map((record, index) => {
            return (
              <Link key={index} className={classNames(s.btn, s.btnLg, s.btnPrimary, s.record)} to={record.fullLink}>
                <span>{record.client}</span> <span>{record.viewLink}</span>
              </Link>
            );
          })}
        </section>
      </div>
    </>
  );
}
