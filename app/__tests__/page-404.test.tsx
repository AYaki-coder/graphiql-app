import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import NotFoundPage from '~/routes/404';

test('404 page should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <NotFoundPage />,
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('page-404'));
  expect(element).not.toBeNull();
});
