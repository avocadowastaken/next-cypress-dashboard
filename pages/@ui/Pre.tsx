import { Language, PrismTheme } from "prism-react-renderer";
import { lazy, ReactElement, Suspense } from "react";

const prismTheme: PrismTheme = { plain: {}, styles: [] };

export interface PreProps {
  code: string;
  language: Language;
}

const LazyPrismReactRenderer = lazy(async () => {
  const { default: Highlight, defaultProps } = await import(
    /* webpackChunkName: "prism-react-renderer" */
    "prism-react-renderer"
  );

  function PrismReactRenderer({ code, language }: PreProps): ReactElement {
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
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    );
  }

  return { default: PrismReactRenderer };
});

export function Pre({ code, language }: PreProps): ReactElement {
  return (
    <Suspense fallback={<pre>{code}</pre>}>
      <LazyPrismReactRenderer code={code} language={language} />
    </Suspense>
  );
}
