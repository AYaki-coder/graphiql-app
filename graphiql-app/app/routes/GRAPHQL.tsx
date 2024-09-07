import { useState } from 'react';

export default function GraphQL() {
  const [result, setResult] = useState(null);

  const sendQuery = async () => {
    const query = `{
      allFilms {
        films {
          title
          releaseDate
          director
          episodeID
        }
      }
    }
    `;

    const response = await fetch('/graphql-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>GraphQL Client</h1>
      <button onClick={sendQuery}>Send GraphQL Query</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
