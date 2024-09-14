import { useParams } from '@remix-run/react';

export function useParamsParts(): string[] {
  const params = useParams();
  const fullPath = params['*'] ?? '';

  const paramsArray: string[] = fullPath.split('/');

  return paramsArray;
}
