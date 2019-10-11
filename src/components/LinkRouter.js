import { Link } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

export function LinkRouter(props) {
  return <Link {...props} color="inherit" component={RouterLink} />;
}
