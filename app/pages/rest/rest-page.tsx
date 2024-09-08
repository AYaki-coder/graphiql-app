import { useState } from 'react';
import { IReq } from '~/models/rest';
import s from './rest-page.module.scss';
import classNames from 'classnames';

const sendQuery = async (req: IReq, setFunc: React.Dispatch<React.SetStateAction<unknown>>) => {
  const response = await fetch('/rest-query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ req }),
  });

  const data = await response.json();
  setFunc(data);
};

const sendGet = (setFunc: React.Dispatch<React.SetStateAction<unknown>>) => {
  const query = {
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  sendQuery(query, setFunc);
};

const sendPost = (setFunc: React.Dispatch<React.SetStateAction<unknown>>) => {
  const query = {
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1,
    }),
  };

  sendQuery(query, setFunc);
};

export default function RestPage() {
  const [result, setResult] = useState<unknown>(null);

  return (
    <div>
      <h1>Rest Client</h1>
      <div className={s.actions}>
        <button className={classNames(s.submitButton, s.btn, s.btnPrimary)} onClick={() => sendGet(setResult)}>
          Send Get
        </button>
        <button className={classNames(s.submitButton, s.btn, s.btnLight)} onClick={() => sendPost(setResult)}>
          Send Post
        </button>
      </div>
      {!!result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
