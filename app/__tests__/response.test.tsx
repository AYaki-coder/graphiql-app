import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import ResponseView from '~/components/response/responseView';
import { ResponseViewType } from '~/models/response';

test('Response should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => (
        <ResponseView
          status={200}
          type={ResponseViewType.JSON}
          data={{
            name: 'test',
            age: 20,
          }}
        />
      ),
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('response'));
  expect(element).not.toBeNull();
});
