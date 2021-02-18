import { createMuiTheme, Link, ThemeProvider } from "@material-ui/core";
import { Components, MDXProvider } from "@mdx-js/react";
import { ReactElement, ReactNode } from "react";

const theme = createMuiTheme({
  palette: {
    mode: "dark",

    primary: { main: "#2196f3", dark: "#0d47a1" },
    secondary: { main: "#78909c" },
    error: { main: "#f44336" },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        code: {
          margin: 0,
          fontSize: ".85em",
          padding: ".2em .4em",
          borderRadius: "4px",
          backgroundColor: "#616161",
          fontFamily: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
        },

        pre: {
          margin: 0,
          padding: "16px",
          overflow: "auto",
          borderRadius: "4px",
          backgroundColor: "#616161",

          "& > code": {
            padding: 0,
          },

          //           padding: 16px;
          //           overflow: auto;
          //           font-size: 85%;
          // line-height: 1.45;
          // background-color: var(--color-bg-tertiary);
          // border-radius: 6px;
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

    MuiButton: {
      defaultProps: {
        disableElevation: true,
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

const mdxComponents: Components = {
  a: Link,
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
