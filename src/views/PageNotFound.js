import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Header } from "../components/Header";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    height: "100%",
    display: "flex",
    flexFlow: "column"
  },
  content: {
    marginTop: "64px",
    padding: "24px",
    flex: 1,
    display: "flex",
    flexFlow: "row",
    justifyContent: "center",
    alignItems: "center"
  }
}));

export function PageNotFound() {
  const classes = useStyles();

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header />
      <Container maxWidth="md" className={classes.content}>
        <Typography variant="h3">404 Not Found</Typography>
      </Container>
    </Container>
  );
}
