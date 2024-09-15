import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import Login from '~/routes/signin';

test('Sing-in page should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <Login />,
      loader() {
        return null;
      },
      action() {
        return null;
      },
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('sing-in'));
  expect(element).not.toBeNull();
});
