import {
  extractErrorCode,
  formatAppError,
  getAppErrorStatusCode,
} from "@/core/data/AppError";
import Error from "next/error";
import React, { ReactElement, useEffect } from "react";

export interface ErrorPageProps {
  error: unknown;
}

export function useErrorHandler(error: unknown): void {
  useEffect(() => {
    const errorCode = !error ? null : extractErrorCode(error);

    if (errorCode === "UNAUTHORIZED") {
      const callbackUrl = encodeURIComponent(window.location.href);

      window.location.replace(`/api/auth/signin?callbackUrl=${callbackUrl}`);
    }
  }, [error]);
}

export function ErrorPage({ error }: ErrorPageProps): ReactElement {
  useErrorHandler(error);

  return (
    <Error
      title={formatAppError(error)}
      statusCode={getAppErrorStatusCode(error)}
    />
  );
}
