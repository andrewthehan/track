import { Container, CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "typeface-roboto";
import "./App.css";
import { darkTheme } from "./theme";
import { Collection } from "./views/Collection";
import { Home } from "./views/Home";
import { NewAccount } from "./views/NewAccount";
import { PageNotFound } from "./views/PageNotFound";
import { Profile } from "./views/Profile";
import { Series } from "./views/Series";

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/new",
    component: NewAccount
  },
  {
    path: "/user/:user",
    component: Profile
  },
  {
    path: "/user/:user/collection/:collection",
    component: Collection
  },
  {
    path: "/user/:user/collection/:collection/series/:series",
    component: Series
  },
  {
    path: null,
    component: PageNotFound
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    height: "100%"
  }
}));

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth={false} className={classes.root}>
        <Router>
          <Switch>
            {routes.map((route, i) => (
              <Route exact key={i} {...route} />
            ))}
          </Switch>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
