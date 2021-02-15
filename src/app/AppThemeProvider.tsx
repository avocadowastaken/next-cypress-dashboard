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
