import { ActionFunctionArgs, json } from '@remix-run/node';
import { IReq } from '~/models/rest';

export async function action({ request }: ActionFunctionArgs) {
  const { req }: { req: IReq } = await request.json();

  console.log(req);

  const { url, headers, method, body } = req;

  const response = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify({ body }) } : {}),
  });

  const data = await response.json();
  return json(data);
}
