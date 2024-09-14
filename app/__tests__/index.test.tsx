import { expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Index from '~/routes/_index';
import { json } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';

test('Main page should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Index,
      loader() {
        return json({ message: 'hello' });
      },
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('mainpage-section'));
  expect(element).not.toBeNull();
});
