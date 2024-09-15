import { useContext } from 'react';
import { JSONTree } from 'react-json-tree';
import { ResponseViewProps, ResponseViewType } from '~/models/response';
import { LangContext } from '../lang-context/lang-context';

const theme = {
  scheme: 'default',
  author: 'default',
  base00: '#ffffff',
  base01: '#f5f5f5',
  base02: '#dcdcdc',
  base03: '#c0c0c0',
  base04: '#808080',
  base05: '#333333',
  base06: '#404040',
  base07: '#202020',
  base08: '#e31a1c',
  base09: '#d2691e',
  base0A: '#ffcc00',
  base0B: '#008000',
  base0C: '#00ced1',
  base0D: '#1e90ff',
  base0E: '#c71585',
  base0F: '#8b4513',
};

export default function ResponseView(props: ResponseViewProps) {
  const { status, type, data } = props;
  const { langRecord } = useContext(LangContext);

  return (
    <div>
      <h2>{langRecord.graphqlPage?.responseLabel ?? ''}</h2>
      <p>
        {langRecord.graphqlPage?.statusLabel ?? ''}: {status}
      </p>
      {type === ResponseViewType.JSON ? (
        <pre>
          <code>
            <JSONTree data={data} theme={theme} invertTheme={false} />
          </code>
        </pre>
      ) : (
        <pre>{data as string}</pre>
      )}
    </div>
  );
}
