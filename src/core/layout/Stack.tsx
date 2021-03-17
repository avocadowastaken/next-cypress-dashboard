import { Grid, GridSpacing } from "@material-ui/core";
import { Children, ReactElement, ReactNode } from "react";

export interface StackProps {
  children?: ReactNode;
  spacing?: GridSpacing;
}
export function Stack({ children, spacing = 1 }: StackProps): ReactElement {
  return (
    <Grid container={true} spacing={spacing}>
      {Children.map(
        children,
        (child, idx) =>
          !!child && (
            <Grid key={idx} item={true} xs={12}>
              {child}
            </Grid>
          )
      )}
    </Grid>
  );
}
