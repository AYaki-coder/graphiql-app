import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ErrorBoundary } from '~/root';

test('Error-boundary should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <ErrorBoundary />,
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('error-boundary'));
  expect(element).not.toBeNull();
});
