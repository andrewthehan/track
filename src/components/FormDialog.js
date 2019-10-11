import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import React from "react";

export function FormDialog({
  children,
  title,
  description,
  action,
  open,
  onClose,
  submitText = "Submit",
  submitDisabled = false
}) {
  const handleSubmit = e => {
    e.preventDefault();

    action();
    onClose();
  };

  return (
    <Dialog
      aria-labelledby="title"
      aria-describedby="description"
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="description">{description}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={submitDisabled}
          >
            {submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
