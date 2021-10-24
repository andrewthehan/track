import { Container, makeStyles, Paper } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "24px",
    display: "flex",
    flexFlow: "column",
  },
  paper: {
    display: "flex",
    flexFlow: "column",
    flex: 1,
    height: "100%",
  },
}));

export function Frame({ children, maxWidth }) {
  const classes = useStyles();

  return (
    <Container maxWidth={maxWidth} className={classes.container}>
      <Paper elevation={0} className={classes.paper}>
        {children}
      </Paper>
    </Container>
  );
}
