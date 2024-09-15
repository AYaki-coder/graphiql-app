import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { json } from '@remix-run/node';
import Header from '~/components/header/header';

test('Header should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Header,
      loader() {
        return json({
          email: 'some email',
          id: 'some id',
          sessionExpireTime: Date.now() + 14 * 24 * 3600 * 1000,
        });
      },
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('header'));
  expect(element).not.toBeNull();
});

test('Header should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Header,
      loader() {
        return json(null);
      },
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('header'));
  expect(element).not.toBeNull();
});
