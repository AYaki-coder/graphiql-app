import { describe, expect, test } from 'vitest';
import { formatGraphQL } from '~/utils/formatterGraphQL';

describe('formatGraphQL2', () => {
  test('should format a simple GraphQL query with correct indentation', () => {
    const inputQuery = `
      query {
        user {
          id
          name
        }
      }
    `;
    const expectedOutput = `query {\n  user {\n    id\n    name\n  }\n}`;
    const formattedQuery = formatGraphQL(inputQuery);
    expect(formattedQuery).toBe(expectedOutput);
  });

  test('should handle empty input', () => {
    const inputQuery = '';
    const expectedOutput = '';
    const formattedQuery = formatGraphQL(inputQuery);
    expect(formattedQuery).toBe(expectedOutput);
  });

  test('should format nested query with multiple levels of indentation', () => {
    const inputQuery = `
      query {
        user {
          id
          name
          posts {
            title
            comments {
              text
            }
          }
        }
      }
    `;
    const expectedOutput = `query {\n  user {\n    id\n    name\n    posts {\n      title\n      comments {\n        text\n      }\n    }\n  }\n}`;
    const formattedQuery = formatGraphQL(inputQuery);
    expect(formattedQuery).toBe(expectedOutput);
  });
});
