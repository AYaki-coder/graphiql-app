import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import Header from '~/components/header/header';

test('Header should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Header,
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('header'));
  expect(element).not.toBeNull();
});
