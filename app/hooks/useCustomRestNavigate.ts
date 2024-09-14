import { useNavigate, useParams, useSearchParams } from '@remix-run/react';
import { useCallback } from 'react';
import { REST_VERBS } from '~/consts/restful.consts';
import { NavigateOptions } from 'react-router';

type TNewNavigate = (newMethod: string, base64Url: string, base64BodySection: string, params?: NavigateOptions) => void;

export function useCustomRestNavigate(): TNewNavigate {
  const navigate = useNavigate();
  const [URLSearchParams] = useSearchParams();
  const URLSearchParamsToString = URLSearchParams.toString();
  const searchParamsString = URLSearchParamsToString ? `?${URLSearchParamsToString}` : '';
  const newNavigate = useCallback(
    (newMethod: string, base64Url: string, base64BodySection: string, params?: NavigateOptions) => {
      const isNewMethodGet = newMethod.toUpperCase() === REST_VERBS[0];

      let url = '/';
      if (isNewMethodGet) {
        url = `/${newMethod}/${base64Url}`;
      } else {
        url = `/${newMethod}/${base64Url}/${base64BodySection ?? ''}`;
      }

      navigate({ pathname: url, search: searchParamsString }, params);
    },
    [navigate, searchParamsString],
  );

  return newNavigate;
}
