import { ReactElement, ReactNode } from "react";

export interface PreProps {
  children?: ReactNode;
}

export function Pre({ children }: PreProps): ReactElement {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}
