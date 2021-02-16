import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from "@material-ui/core";
import React, { ReactElement } from "react";

export interface AddProjectFormProps {
  onSubmit: (data: URLSearchParams) => void;
}

export default function AddProjectForm({
  onSubmit,
}: AddProjectFormProps): ReactElement {
  return (
    <form
      method="get"
      onSubmit={(event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const repo = data.get("repo");
        const owner = data.get("owner");

        if (typeof repo != "string" || typeof owner != "string") {
          window.alert("Invalid Input");
        } else {
          onSubmit(new URLSearchParams({ repo, owner }));
        }
      }}
    >
      <Card>
        <CardContent>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              <TextField
                name="owner"
                label="Owner"
                fullWidth={true}
                required={true}
              />
            </Grid>

            <Grid item={true} xs={12}>
              <TextField
                name="repo"
                label="Repo"
                fullWidth={true}
                required={true}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Button type="submit">Submit</Button>
        </CardActions>
      </Card>
    </form>
  );
}
