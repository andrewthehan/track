import { CircularProgress, Container, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

export function Loading() {
  const classes = useStyles();

  return (
    <Container maxWidth={null} className={classes.container}>
      <CircularProgress className={classes.progress} />
    </Container>
  );
}
