import {
  createMuiTheme,
  CssBaseline,
  Link,
  ScopedCssBaseline,
  ThemeProvider,
} from "@material-ui/core";
import { blue, blueGrey, grey, red } from "@material-ui/core/colors";
import { Components, MDXProvider } from "@mdx-js/react";
import Head from "next/head";
import NextLink from "next/link";
import React, {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";

const theme = createMuiTheme({
  palette: {
    mode: "dark",

    primary: { main: blue[500], dark: blue[900] },
    secondary: { main: blueGrey[400] },
    error: { main: red[500] },
  },

  components: {
    MuiScopedCssBaseline: {
      styleOverrides: {
        root: {
          "& pre": {
            fontSize: "12px",
            borderRadius: "4px",
          },

          "& code": {
            margin: 0,
            backgroundColor: "#2d2d2d",
            fontSize: "85%",
            padding: ".2em .4em",
            borderRadius: "4px",
            fontFamily:
              "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
          },

          "& blockquote": {
            margin: 0,
            padding: "8px 16px",
            borderLeft: `.25em solid ${blue[700]}`,

            "& p": {
              margin: 0,
            },
          },
        },
      },
    },

    MuiAlert: {
      defaultProps: {
        variant: "filled",
      },
    },

    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "default",
      },
    },

    MuiBreadcrumbs: {
      defaultProps: {
        maxItems: 3,
        separator: "–",
      },
    },

    MuiButtonBase: {
      defaultProps: {
        type: "button",
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiChip: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          backgroundColor: grey[800],
        },
      },
    },

    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },

    MuiTypography: {
      defaultProps: {
        display: "inline",
      },
    },

    MuiPagination: {
      defaultProps: {
        siblingCount: 1,
        boundaryCount: 1,
        color: "primary",
        variant: "outlined",
      },
    },

    MuiModal: {
      defaultProps: {
        container: () => document.querySelector(".MuiScopedCssBaseline-root"),
      },
    },
  },
});

function MDXAnchor({
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>): ReactElement {
  return !href || href.startsWith("#") ? (
    <Link {...props} href={href} />
  ) : !href.startsWith("/") ? (
    <Link {...props} href={href} target="_blank" rel="noopener noreferrer" />
  ) : (
    <NextLink passHref={true} href={href}>
      <Link {...props} />
    </NextLink>
  );
}

function MDXHeading({
  as: Heading,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  const anchor =
    typeof children !== "string"
      ? ""
      : children.toLowerCase().replace(/\s/g, "_");

  return (
    <Heading {...props}>
      {!!anchor && (
        <Link
          id={anchor}
          sx={{ position: "absolute", marginTop: "calc(-63px - 1em)" }}
        />
      )}

      {children}
    </Heading>
  );
}

const mdxComponents: Components = {
  a: MDXAnchor,
  h1: (props) => <MDXHeading {...props} as="h1" />,
  h2: (props) => <MDXHeading {...props} as="h2" />,
  h3: (props) => <MDXHeading {...props} as="h3" />,
  h4: (props) => <MDXHeading {...props} as="h4" />,
  h5: (props) => <MDXHeading {...props} as="h5" />,
  h6: (props) => <MDXHeading {...props} as="h6" />,
};

export interface ThemeConfigProps {
  children?: ReactNode;
}

export function AppThemeProvider({ children }: ThemeConfigProps): ReactElement {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/prismjs@1.23.0/themes/prism-tomorrow.css"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <MDXProvider components={mdxComponents}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <ScopedCssBaseline>{children}</ScopedCssBaseline>
        </ThemeProvider>
      </MDXProvider>
    </>
  );
}
