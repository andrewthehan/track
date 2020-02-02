import {
  AppBar,
  InputBase,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { debounce } from "../utils/FunctionUtils";
import { isAnyNull } from "../utils/ObjectUtils";

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: "4px 4px 0 0"
  },
  content: {
    display: "flex",
    justifyContent: "space-between"
  },
  title: {},
  input: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    flex: 1,
    background: theme.palette.primary.dark,
    padding: theme.spacing(0.5)
  }
}));

export function FrameHeader({ children, title, onSearch = null }) {
  const classes = useStyles();

  const searchInputRef = useRef(null);

  useEffect(() => {
    const giveSearchFocus = e => {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        e.preventDefault();

        searchInputRef.current.focus();
      }
    };

    window.addEventListener("keydown", giveSearchFocus);

    return () => {
      window.removeEventListener("keydown", giveSearchFocus);
    };
  }, [searchInputRef]);

  const onSearchDebounced = debounce(onSearch, 250);
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
        inputProps={{ "aria-label": "search", ref: searchInputRef }}
        onChange={handleChange}
      />
    );
  };

  return (
    <AppBar position="static" elevation={0} className={classes.root}>
      <Toolbar className={classes.content}>
        <Typography className={classes.title}>{title}</Typography>
        {renderSearchField()}
        {children}
      </Toolbar>
    </AppBar>
  );
}
