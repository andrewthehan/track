import {
  AppBar,
  InputBase,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { debounce } from "../utils/FunctionUtils";
import { isAnyNull } from "../utils/ObjectUtils";
import { useHistory, useLocation } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "4px 4px 0 0",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {},
  input: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    flex: 1,
    background: theme.palette.primary.dark,
    padding: theme.spacing(0.5),
  },
}));

export function FrameHeader({ children, title, onSearch = null }) {
  const classes = useStyles();

  const searchInputRef = useRef(null);

  useEffect(() => {
    const giveSearchFocus = (e) => {
      if (onSearch == null) {
        return;
      }

      // F3 or CTRL+F
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        e.preventDefault();

        searchInputRef.current.focus();
        searchInputRef.current.select();
      }
    };

    window.addEventListener("keydown", giveSearchFocus);

    return () => {
      window.removeEventListener("keydown", giveSearchFocus);
    };
  }, [onSearch, searchInputRef]);

  const history = useHistory();
  const location = useLocation();
  const defaultQuery = new URLSearchParams(location.search).get("q");
  if (onSearch != null) {
    onSearch(defaultQuery);
  }

  const onChangeDebounce = debounce((search) => history.push({ search }), 250);
  const handleChange = (e) => {
    const query = e.target.value;
    const search = query.length === 0 ? null : `?q=${query}`;

    onChangeDebounce(search);
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
        defaultValue={defaultQuery}
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
