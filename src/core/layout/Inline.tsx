import { Grid, GridSpacing } from "@material-ui/core";
import { Children, ReactElement, ReactNode } from "react";

export interface InlineProps {
  children?: ReactNode;
  spacing?: GridSpacing;
}
export function Inline({ children, spacing = 1 }: InlineProps): ReactElement {
  return (
    <Grid container={true} spacing={spacing}>
      {Children.map(children, (child, idx) => (
        <Grid key={idx} item={true}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
}
