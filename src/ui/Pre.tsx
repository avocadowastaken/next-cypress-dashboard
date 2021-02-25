import Highlight, {
  defaultProps,
  Language,
  PrismTheme,
} from "prism-react-renderer";
import { ReactElement } from "react";

const prismTheme: PrismTheme = { plain: {}, styles: [] };

export interface PreProps {
  code: string;
  language: Language;
}

export function Pre({ code, language }: PreProps): ReactElement {
  return (
    <Highlight
      {...defaultProps}
      code={code}
      theme={prismTheme}
      language={language}
    >
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <pre className={className}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
