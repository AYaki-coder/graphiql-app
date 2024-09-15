import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import SignUp from '~/routes/signup';

test('Sign-up page should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <SignUp />,
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('sign-up'));
  expect(element).not.toBeNull();
});
