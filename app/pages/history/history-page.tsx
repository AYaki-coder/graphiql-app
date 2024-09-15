import { Link } from '@remix-run/react';
import s from './history-page.module.scss';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { LangContext } from '~/components/lang-context/lang-context';
import { IUser } from '~/models/root';
import { CLIENT_TYPE, historyService, IHistoryItem } from '~/utils/history-service';

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
      <div className={s.wrapper}>
        <div className={s.page}>
          <h1>{langRecord.history.title}</h1>
          <div className={classNames(s.card, s.gap)}>
            {historyRecords.map((record, index) => {
              return (
                <Link key={index} className={classNames(s.record)} to={record.fullLink}>
                  <span
                    className={classNames(
                      s.pill,
                      { [s.pillInfo]: record.client === CLIENT_TYPE.graph },
                      { [s.pillSuccess]: record.client === CLIENT_TYPE.rest },
                    )}>
                    {record.client}
                  </span>
                  <p className={classNames()}>{record.viewLink}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
