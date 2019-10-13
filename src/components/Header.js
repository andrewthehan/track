import {
  AppBar,
  Avatar,
  Breadcrumbs,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ListAlt as ListAltIcon,
  NavigateNext as NavigateNextIcon
} from "@material-ui/icons";
import React, { useState } from "react";
import { signInWithPopup, signOut } from "../store/Firebase";
import { useCurrentUser } from "../store/Hooks";
import { zip } from "../utils/ArrayUtils";
import { useScrollPosition } from "../utils/HookUtils";
import { isAnyNull } from "../utils/ObjectUtils";
import { LinkRouter } from "./LinkRouter";

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.appBar + 1,
    backgroundColor: theme.palette.background.default,
    boxShadow: "none",
    transition: "background-color .5s, box-shadow .5s"
  },
  appBarScrolled: {
    zIndex: theme.zIndex.appBar + 1,
    backgroundColor: theme.palette.primary.main,
    transition: "background-color .5s, box-shadow .5s"
  },
  breadcrumbs: {
    flex: 1
  }
}));

export function Header({ location = [] }) {
  const classes = useStyles();

  const currentUser = useCurrentUser();

  const [anchorEl, setAnchorEl] = useState();

  const scrollPosition = useScrollPosition(window);

  const renderLogo = () => {
    return (
      <LinkRouter to="/">
        <IconButton edge="start" color="inherit" aria-label="logo">
          <ListAltIcon />
        </IconButton>
      </LinkRouter>
    );
  };

  const renderBreadcrumbs = () => {
    return (
      <Breadcrumbs
        className={classes.breadcrumbs}
        color="textPrimary"
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <LinkRouter to="/">Track</LinkRouter>
        {location.map((value, i) => {
          const last = i === location.length - 1;
          if (last) {
            return <Typography key={i}>{value}</Typography>;
          }

          const hierarchy = ["user", "collection", "entry"];
          const values = location.slice(0, i + 1).map(encodeURIComponent);

          const to = `/${zip(hierarchy.slice(0, values.length), values)
            .flat(1)
            .join("/")}`;

          return (
            <LinkRouter key={i} to={to}>
              {value}
            </LinkRouter>
          );
        })}
      </Breadcrumbs>
    );
  };

  const renderProfile = () => {
    const handleSignIn = async () => {
      await signInWithPopup();
    };

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleSignOut = async () => {
      await signOut();
      setAnchorEl(null);
    };

    if (isAnyNull(currentUser)) {
      return (
        <Button color="inherit" onClick={handleSignIn}>
          Sign in
        </Button>
      );
    }

    return (
      <div>
        <Button
          aria-controls="avatar"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Avatar alt="Profile Picture" src={currentUser.photoURL} />
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    <AppBar
      position="fixed"
      className={
        scrollPosition.y === 0 ? classes.appBar : classes.appBarScrolled
      }
    >
      <Toolbar>
        {renderLogo()}
        {renderBreadcrumbs()}
        {renderProfile()}
      </Toolbar>
    </AppBar>
  );
}
