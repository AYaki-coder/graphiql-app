import { json } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { RestPage } from '~/pages/rest/rest-page';

test('Rest-page should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <RestPage user={{ email: 'test@test.com', id: '123', sessionExpireTime: Date.now() }} />,
      loader() {
        return json({ email: 'test@test.com', id: '123', sessionExpireTime: Date.now() });
      },
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('rest-page'));
  expect(element).not.toBeNull();
});
