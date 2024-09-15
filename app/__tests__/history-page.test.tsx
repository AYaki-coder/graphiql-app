import { json } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import History from '~/routes/history';
import { CLIENT_TYPE, historyService } from '~/utils/history-service';

describe('History Page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('History-page should be rendered without errors', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <History />,
        loader() {
          return json({ email: 'test@test.com', id: '123', sessionExpireTime: Date.now() });
        },
      },
    ]);

    render(<RemixStub />);
    const element = await waitFor(() => screen.getByTestId('history-page'));
    expect(element).not.toBeNull();
  });

  test('History-page should be rendered with links without errors', async () => {
    vi.spyOn(historyService, 'getItems').mockReturnValue([
      {
        fullLink: 'fullLink',
        viewLink: 'viewLink',
        client: CLIENT_TYPE.graph,
      },
      {
        fullLink: 'fullLink',
        viewLink: 'viewLink',
        client: CLIENT_TYPE.rest,
      },
    ]);
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <History />,
        loader() {
          return json({ email: 'test@test.com', id: '123', sessionExpireTime: Date.now() });
        },
      },
    ]);

    render(<RemixStub />);
    const element = await waitFor(() => screen.getByTestId('history-page'));
    expect(element).not.toBeNull();
  });
});
