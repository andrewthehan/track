import { AppBar, makeStyles, Toolbar, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
  title: {
    flex: 1
  }
}));

export function FrameHeader({ children, title }) {
  const classes = useStyles();

  return (
    <AppBar square={false} position="static" elevation={0}>
      <Toolbar>
        <Typography className={classes.title}>{title}</Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
