import { useSearchParams } from '@remix-run/react';
import { useCallback } from 'react';
import { REST_VERBS_WITHOUT_BODY } from '~/consts/restful.consts';
import { CLIENT_TYPE, historyService } from '~/utils/history-service';

type TNewRecord = (
  client: CLIENT_TYPE,
  email: string,
  method: string,
  utf8Url: string,
  base64Url: string,
  base64BodySection: string,
) => void;

export function useCreateHistoryRecord(): TNewRecord {
  const [URLSearchParams] = useSearchParams();
  const URLSearchParamsToString = URLSearchParams.toString();
  const searchParamsString = URLSearchParamsToString ? `?${URLSearchParamsToString}` : '';
  const setHistoryRecord = useCallback(
    (
      client: CLIENT_TYPE,
      email: string,
      method: string,
      utf8Url: string,
      base64Url: string,
      base64BodySection: string,
    ) => {
      const isMethodWithBody = REST_VERBS_WITHOUT_BODY.some(verb => method.toUpperCase() === verb);

      let fullLink = '/';
      if (isMethodWithBody) {
        fullLink = `/${method}/${base64Url}`;
      } else {
        fullLink = `/${method}/${base64Url}/${base64BodySection ?? ''}`;
      }
      fullLink += searchParamsString;

      historyService.setItem(email, {
        client,
        viewLink: `${method}  ${utf8Url}`,
        fullLink,
      });
    },
    [searchParamsString],
  );

  return setHistoryRecord;
}
