import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { HeadersSelector } from '~/components/headers-selector/headers-selector';

test('Header-selector should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => (
        <HeadersSelector
          addDefaultContentType={true}
          notifyOnInit={false}
          notifyOnChange={true}
          onHeadersChange={() => {}}
        />
      ),
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('headers-selector'));
  expect(element).not.toBeNull();
});
