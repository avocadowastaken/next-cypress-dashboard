import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { ReactElement } from "react";

export default function AddProjectForm(): ReactElement {
  return (
    <form method="get">
      <Card>
        <Box padding="16px">
          <TextField
            name="repo"
            label="Repo URL"
            required={true}
            fullWidth={true}
            autoFocus={true}
            placeholder="https://github.com/umidbekk/next-cypress-dashboard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" type="submit">
                    <Add color="action" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Card>
    </form>
  );
}
