import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { ActionFunctionArgs, LinksFunction } from '@remix-run/node';

import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import s from './root.module.scss';
import { LangProvider } from './components/lang-context/lang-context';
import { sessionSignOut } from './firebase/session';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
  },
];

import { LoaderFunctionArgs } from '@remix-run/node';
import { getUserSession } from '~/firebase/session';
import { IUser } from './models/root';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  console.log(sessionUser, 'sessionUser', sessionUser?.firebase.identities);
  if (sessionUser) {
    const user: IUser = {
      email: sessionUser.email ?? '',
      id: sessionUser.user_id ?? '',
      sessionExpireTime: Date.now() + 6 * 60 * 1000, // sessionUser.exp * 1000,
    };

    return user;
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  return sessionSignOut(request);
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={s.body}>
        <LangProvider>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </LangProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
