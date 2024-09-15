import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import Footer from '~/components/footer/footer';

test('Footer should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Footer,
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('footer'));
  expect(element).not.toBeNull();
});
