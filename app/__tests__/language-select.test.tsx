import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import LanguageSelect from '~/components/language-select/language-select';

test('Language-select should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: LanguageSelect,
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('lang-select'));
  expect(element).not.toBeNull();
});
