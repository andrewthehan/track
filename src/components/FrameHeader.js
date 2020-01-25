import {
  AppBar,
  InputBase,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import React from "react";
import { isAnyNull } from "../utils/ObjectUtils";
import { debounce } from "../utils/FunctionUtils";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  title: {
    flex: 1
  },
  input: {
    flex: 10,
    marginLeft: theme.spacing(3),
    background: theme.palette.primary.dark,
    padding: theme.spacing(0.5)
  }
}));

export function FrameHeader({ children, title, onSearch = null }) {
  const classes = useStyles();

  const onSearchDebounced = debounce(onSearch, 500);
  const handleChange = e => {
    onSearchDebounced(e.target.value);
  };

  const renderSearchField = () => {
    if (isAnyNull(onSearch)) {
      return null;
    }

    return (
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        onChange={handleChange}
      />
    );
  };

  return (
    <AppBar square={false} position="static" elevation={0}>
      <Toolbar className={classes.root}>
        <Typography className={classes.title}>{title}</Typography>
        {renderSearchField()}
        {children}
      </Toolbar>
    </AppBar>
  );
}
