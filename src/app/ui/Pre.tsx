import { ReactNode } from "react";

export interface PreProps {
  children?: ReactNode;
}

export function Pre({ children }: PreProps) {
  return (
    <pre
      onClick={(event) => {
        const range = new Range();
        range.setStart(event.currentTarget, 0);
        range.setEnd(event.currentTarget, 1);

        document.getSelection()?.removeAllRanges();
        document.getSelection()?.addRange(range);
      }}
    >
      <code>{children}</code>
    </pre>
  );
}
