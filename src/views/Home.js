import { Button, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Header } from "../components/Header";
import { LinkRouter } from "../components/LinkRouter";
import { useCurrentUser, useData } from "../store/Hooks";
import { isAnyNull } from "../utils/ObjectUtils";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    height: "100%",
    display: "flex",
    flexFlow: "column"
  },
  content: {
    marginTop: "48px",
    padding: "24px",
    flex: 1,
    display: "flex",
    flexFlow: "row",
    justifyContent: "center",
    alignItems: "center"
  }
}));

export function Home() {
  const classes = useStyles();

  const currentUser = useCurrentUser();
  const user = useData(["users", currentUser != null ? currentUser.uid : null]);

  const renderNewAccount = () => {
    if (!isAnyNull(user)) {
      return null;
    }

    return (
      <LinkRouter to="/new" underline="none">
        <Button variant="contained" color="secondary">
          Create a new account
        </Button>
      </LinkRouter>
    );
  };

  const renderCurrentAccount = () => {
    if (isAnyNull(user)) {
      return null;
    }

    return (
      <LinkRouter to={`/user/${user.name}`} underline="none">
        <Button variant="contained" color="secondary">
          View my account
        </Button>
      </LinkRouter>
    );
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header />
      <Container maxWidth="md" className={classes.content}>
        {renderNewAccount()}
        {renderCurrentAccount()}
      </Container>
    </Container>
  );
}
