import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowForward as ArrowForwardIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Header } from "../components/Header";
import { useAsyncEffect, useCurrentUser } from "../store/Hooks";
import { getDoc, setDoc } from "../store/Store";
import { isAnyNull } from "../utils/ObjectUtils";

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
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  form: {}
}));

export function NewAccount() {
  const classes = useStyles();

  const currentUser = useCurrentUser();

  const [values, setValues] = useState({
    name: ""
  });
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const history = useHistory();

  useAsyncEffect(async () => {
    if (isAnyNull(currentUser)) {
      return;
    }

    const user = await getDoc(["users", currentUser.uid]);

    if (!user.exists) {
      return;
    }

    history.push(`/user/${user.data().name}`);
  }, [currentUser, history]);

  const handleSubmit = async e => {
    e.preventDefault();

    await setDoc(["users", currentUser.uid], { name: values.name });

    history.push(`/user/${values.name}`);
  };

  const renderLogin = () => {
    if (currentUser != null) {
      return null;
    }

    return (
      <Typography variant="body1">
        Please sign in to create an account.
      </Typography>
    );
  };

  const renderCreateForm = () => {
    if (isAnyNull(currentUser)) {
      return null;
    }

    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <DialogTitle>
          Choose a unique username to display to others.
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            required
            autoFocus
            fullWidth
            label="Username"
            onChange={handleChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            endIcon={<ArrowForwardIcon />}
            disabled={!values.name}
            type="submit"
          >
            Create
          </Button>
        </DialogActions>
      </form>
    );
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header location={["Create an account"]} />
      <Container maxWidth="md" className={classes.content}>
        {renderLogin()}
        {renderCreateForm()}
      </Container>
    </Container>
  );
}
