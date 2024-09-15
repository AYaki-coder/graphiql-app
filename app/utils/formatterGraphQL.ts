import { format } from 'graphql-formatter';

function formatGraphQL2(query: string): string {
  query = query.trim();

  query = query.replace(/\s*{\s*/g, ' {\n').replace(/\s*}\s*/g, '\n}');

  const lines = query.split('\n');

  let indentLevel = 0;

  const indentSpace = '  ';

  const formattedLines = [];

  for (let line of lines) {
    line = line.trim();

    if (line === '') continue;

    if (line.startsWith('}')) {
      indentLevel--;
    }

    formattedLines.push(indentSpace.repeat(indentLevel) + line);

    if (line.endsWith('{')) {
      indentLevel++;
    }
  }

  const formattedQuery = format(
    formattedLines.join('\n').replace(/(\w+)\s+(\w+)/g, '$1\n' + indentSpace.repeat(indentLevel) + '$2'),
  );
  return formattedQuery.replace(/\t/g, '  ');
}

export function formatGraphQL(query: string): string {
  query = query.trim();

  query = query.replace(/\s*{\s*/g, ' {\n').replace(/\s*}\s*/g, '\n}');

  const lines = query.split('\n');

  let indentLevel = 0;

  const indentSpace = '  ';

  const formattedLines = [];

  for (let line of lines) {
    line = line.trim();

    if (line === '') continue;

    if (line.startsWith('}')) {
      indentLevel--;
    }

    const words = line.split(/\s+/);
    const formattedLine = words
      .map((word, index) => (index === 0 ? word : '\n' + indentSpace.repeat(indentLevel + 1) + word))
      .join('');

    formattedLines.push(indentSpace.repeat(indentLevel) + formattedLine);

    if (line.endsWith('{')) {
      indentLevel++;
    }
  }

  const formattedQuery = format(formattedLines.join('\n'));

  return formatGraphQL2(formattedQuery);
}
