import { deepPurple, orange } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: deepPurple,
    secondary: orange,
    action: {
      selected: deepPurple[500]
    }
  }
});
