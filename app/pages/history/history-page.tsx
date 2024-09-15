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
      <div className={s.wrapper} data-testid="history-page">
        <div className={s.page}>
          <h1>{langRecord.history.title}</h1>
          {historyRecords.length ? (
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
          ) : (
            <>
              <h4 className={classNames(s.alignTextCenter)}>{langRecord.history.no_records1}</h4>
              <h4 className={classNames(s.alignTextCenter)}>{langRecord.history.no_records2}</h4>
              <div className={s.buttonBlock}>
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
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
