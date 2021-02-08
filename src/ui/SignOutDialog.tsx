import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { Form, FormikProvider, useFormik } from "formik";
import { signOut } from "next-auth/client";

export interface SignOutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SignOutDialog({ open, onClose }: SignOutDialogProps) {
  const formik = useFormik({
    // Reinitialize on `open` change.
    initialValues: { open },
    enableReinitialize: true,
    onSubmit: () => signOut({ callbackUrl: "/" }),
  });

  const { isSubmitting } = formik;

  return (
    <Dialog
      open={open}
      keepMounted={false}
      onClose={!isSubmitting ? onClose : undefined}
    >
      <FormikProvider value={formik}>
        <Form>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to sign out?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button color="secondary" onClick={onClose} disabled={isSubmitting}>
              Dismiss
            </Button>

            <LoadingButton
              type="submit"
              color="primary"
              autoFocus={true}
              pending={isSubmitting}
            >
              Sign Out
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
