import { createMuiTheme, Link, ThemeProvider } from "@material-ui/core";
import { blue, blueGrey, grey, red } from "@material-ui/core/colors";
import { Components, MDXProvider } from "@mdx-js/react";
import NextLink from "next/link";
import {
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
    MuiCssBaseline: {
      styleOverrides: {
        code: {
          margin: 0,
          fontSize: ".85em",
          padding: ".2em .4em",
          borderRadius: "4px",
          backgroundColor: grey[800],
          fontFamily: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
        },

        pre: {
          margin: 0,
          padding: "16px",
          overflow: "auto",
          borderRadius: "4px",
          backgroundColor: grey[800],

          "& > code": {
            padding: 0,
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

    MuiTextField: {
      defaultProps: {
        size: "small",
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
    <MDXProvider components={mdxComponents}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MDXProvider>
  );
}
