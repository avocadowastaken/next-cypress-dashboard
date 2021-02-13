import { RepoField } from "@/app/projects/RepoField";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { Form, FormikProvider, useFormik } from "formik";
import { FormikErrors } from "formik/dist/types";
import React, { ReactElement, useEffect } from "react";
import { UserField } from "./UserField";

export interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (owner: string, repo: string) => void;
}

export function AddProjectDialog({
  open,
  onClose,
  onSubmitSuccess,
}: AddProjectDialogProps): ReactElement {
  const formik = useFormik({
    initialValues: { owner: "", repo: "" },
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {};

      if (!values.owner) {
        errors.owner = "Select repository";
      }

      if (!values.repo) {
        errors.repo = "Select repository";
      }

      return errors;
    },

    onSubmit: async ({ repo, owner }) => {
      const response = await fetch("/api/user/projects", {
        method: "POST",
        body: JSON.stringify({ repo, owner }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message || "Failed to create a project");
      }

      onSubmitSuccess(owner, repo);
    },
  });

  const { dirty, values, resetForm, isSubmitting } = formik;

  useEffect(() => {
    if (!open && dirty) {
      resetForm();
    }
  }, [open, dirty, resetForm]);

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth={true}
      onClose={isSubmitting ? undefined : onClose}
    >
      <FormikProvider value={formik}>
        <Form>
          <DialogTitle>Add Project</DialogTitle>

          <DialogContent>
            <Grid container={true} spacing={2}>
              <Grid item={true} xs={12}>
                <UserField name="owner" label="Owner" />
              </Grid>

              <Grid item={true} xs={12}>
                <RepoField
                  name="repo"
                  label="Repository"
                  owner={values.owner}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button color="primary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <LoadingButton type="submit" color="primary" pending={isSubmitting}>
              Add
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
