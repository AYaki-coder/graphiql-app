import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Index } from '~/routes/_index';

it('render index', () => {
  render(<Index />);
  expect(screen.getByText('Welcome to Index')).toBeDefined();
});
