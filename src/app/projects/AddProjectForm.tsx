import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from "@material-ui/core";
import React, { ReactElement } from "react";

export default function AddProjectForm(): ReactElement {
  return (
    <form method="get">
      <Card>
        <CardContent>
          <TextField
            name="repo"
            label="Repo URL"
            required={true}
            fullWidth={true}
            placeholder="https://github.com/umidbekk/next-cypress-dashboard"
          />
        </CardContent>

        <CardActions>
          <Button type="submit">Submit</Button>
        </CardActions>
      </Card>
    </form>
  );
}
