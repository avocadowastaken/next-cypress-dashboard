import { formatAppError, getAppErrorStatusCode } from "@/core/data/AppError";
import Error from "next/error";
import React, { ReactElement } from "react";

export interface ErrorPageProps {
  error: unknown;
}

export function ErrorPage({ error }: ErrorPageProps): ReactElement {
  return (
    <Error
      title={formatAppError(error)}
      statusCode={getAppErrorStatusCode(error)}
    />
  );
}
