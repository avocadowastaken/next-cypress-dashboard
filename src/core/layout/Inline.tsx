import { Grid, GridSpacing } from "@material-ui/core";
import { Property } from "csstype";
import { Children, ReactElement, ReactNode } from "react";

export interface InlineProps {
  children?: ReactNode;
  spacing?: GridSpacing;
  alignItems?: Property.AlignItems;
  justifyContent?: Property.JustifyContent;
}
export function Inline({
  children,
  spacing = 1,
  alignItems,
  justifyContent,
}: InlineProps): ReactElement {
  return (
    <Grid
      container={true}
      spacing={spacing}
      alignItems={alignItems}
      justifyContent={justifyContent}
    >
      {Children.map(
        children,
        (child, idx) =>
          !!child && (
            <Grid key={idx} item={true}>
              {child}
            </Grid>
          )
      )}
    </Grid>
  );
}
