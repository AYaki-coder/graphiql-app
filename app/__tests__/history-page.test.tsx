import { json } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import History from '~/routes/history';

test('History-page should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <History />,
      loader() {
        return json({ email: 'test@test.com', id: '123', sessionExpireTime: Date.now() });
      },
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('history-page'));
  expect(element).not.toBeNull();
});
