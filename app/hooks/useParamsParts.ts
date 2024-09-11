import { useParams } from '@remix-run/react';

export function useParamsParts(): string[] {
  const params = useParams();
  const fullPath = params['*'] ?? '';

  console.log({ fullPath, params, timestamp: Date.now() });

  const paramsArray: string[] = fullPath.split('/');

  return paramsArray;
}
