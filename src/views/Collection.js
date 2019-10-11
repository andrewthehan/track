import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  InsertDriveFile as InsertDriveFileIcon,
  PostAdd as PostAddIcon
} from "@material-ui/icons";
import React, { useState } from "react";
import { Frame } from "../components/Frame.js";
import { FrameHeader } from "../components/FrameHeader.js";
import { Header } from "../components/Header";
import { LinkRouter } from "../components/LinkRouter";
import { Loading } from "../components/Loading.js";
import {
  useCollectionId,
  useData,
  useIsLoading,
  useIsOwner,
  useUserId
} from "../store/Hooks";
import { addDoc } from "../store/Store.js";

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
    display: "flex",
    flexFlow: "row",
    justifyContent: "center"
  },
  seriesContainer: {
    flex: 1,
    height: "100%"
  },
  seriesHeaderTitle: {
    flex: 1
  },
  seriesList: {
    flex: 1
  }
}));

export function Collection({ match }) {
  const { params, url } = match;

  const classes = useStyles();

  const userId = useUserId(params.user);
  const collectionId = useCollectionId(params.user, params.collection);
  const isOwner = useIsOwner(userId);
  const collection = useData(["users", userId, "collections", collectionId]);
  const series = useData([
    "users",
    userId,
    "collections",
    collectionId,
    "series"
  ]);

  const isLoading = useIsLoading(collection, series);

  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);

  const [createSeriesValues, setCreateSeriesValues] = useState({
    name: ""
  });

  const renderSeriesHeader = () => {
    const handleChange = name => event => {
      setCreateSeriesValues({
        ...createSeriesValues,
        [name]: event.target.value
      });
    };

    const handleOpen = () => {
      setCreateSeriesOpen(true);
    };

    const handleClose = () => {
      setCreateSeriesOpen(false);
      setCreateSeriesValues({});
    };

    const handleSubmit = async e => {
      e.preventDefault();

      await addDoc(["users", userId, "collections", collectionId, "series"], {
        name: createSeriesValues.name,
        length: 0
      });
      setCreateSeriesOpen(false);
    };

    const renderCreateSeriesButton = () => {
      if (!isOwner) {
        return null;
      }

      return [
        <IconButton
          key="button"
          color="inherit"
          aria-label="add"
          onClick={handleOpen}
        >
          <PostAddIcon />
        </IconButton>,

        <Dialog
          key="dialog"
          open={createSeriesOpen}
          onClose={handleClose}
          aria-labelledby="create-series-dialog"
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>Create a series</DialogTitle>
            <DialogContent>
              <DialogContentText>
                A series is a personal entry into a collection. Choose a name
                for your series.
              </DialogContentText>
              <TextField
                required
                autoFocus
                fullWidth
                label="Name"
                onChange={handleChange("name")}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={!createSeriesValues.name}
              >
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      ];
    };

    return (
      <FrameHeader title="Series">{renderCreateSeriesButton()}</FrameHeader>
    );
  };

  const renderSeries = (series, i) => {
    return (
      <LinkRouter
        underline="none"
        key={series.name}
        to={`${url}/series/${encodeURIComponent(series.name)}`}
      >
        <ListItem button>
          <ListItemIcon>
            <InsertDriveFileIcon />
          </ListItemIcon>
          <ListItemText primary={series.name} secondary={series.length} />
          {/* <ListSubheader>
            <Typography>{collection.length}</Typography>
          </ListSubheader> */}
        </ListItem>
      </LinkRouter>
    );
  };

  const renderSeriesList = () => {
    return (
      <List aria-label="series" className={classes.seriesList}>
        {series.map(renderSeries)}
      </List>
    );
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header location={[params.user, params.collection]} />
      {isLoading ? (
        <Loading />
      ) : (
        <Container maxWidth="md" className={classes.content}>
          <Frame maxWidth="lg" className={classes.seriesContainer}>
            {renderSeriesHeader()}
            {renderSeriesList()}
          </Frame>
        </Container>
      )}
    </Container>
  );
}
