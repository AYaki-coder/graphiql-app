import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { RestVariablesSelector } from '~/components/rest-variables-selector/rest-variables-selector';

test('Rest-variables-selector should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <RestVariablesSelector variables={{ name: 'test', age: '20' }} onVariablesChange={() => {}} />,
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('rest-variables-selector'));
  expect(element).not.toBeNull();
});
