import { IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import NextLink from "next/link";
import React, { ReactElement } from "react";

export interface BackButtonProps {
  href: string;
}

export function BackButton({ href }: BackButtonProps): ReactElement {
  return (
    <NextLink replace={true} passHref={true} href={href}>
      <IconButton aria-label="go back">
        <ArrowBack />
      </IconButton>
    </NextLink>
  );
}
