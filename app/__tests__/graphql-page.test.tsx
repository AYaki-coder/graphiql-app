import { json } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import GraphQL from '~/routes/graphql.($endpoint).($body)';

test('GraphQL page should be rendered without errors', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => <GraphQL />,
      loader() {
        return json({
          endpointUrlLoader: 'test@test.com',
          queryLoader: 'test',
          variablesLoader: 'test',
          headersLoader: {},
          userEmail: 'test@test.com',
        });
      },
      action() {
        return json({ status: 200, data: {} });
      },
    },
  ]);

  render(<RemixStub />);
  const element = await waitFor(() => screen.getByTestId('graphql-page'));
  expect(element).not.toBeNull();
});
