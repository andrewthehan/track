import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemIcon, ListItemText, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Folder as FolderIcon, PostAdd as PostAddIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { Frame } from "../components/Frame";
import { FrameHeader } from "../components/FrameHeader";
import { Header } from "../components/Header";
import { LinkRouter } from "../components/LinkRouter";
import { Loading } from "../components/Loading";
import { useData, useIsLoading, useIsOwner, useUserId } from "../store/Hooks";
import { addDoc } from "../store/Store";

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
  collectionContainer: {
    flex: 1,
    height: "100%"
  },
  collectionList: {
    flex: 1
  }
}));

export function Profile({ match }) {
  const { params, url } = match;

  const classes = useStyles();

  const userId = useUserId(params.user);
  const isOwner = useIsOwner(userId);
  const collections = useData(["users", userId, "collections"]);

  const isLoading = useIsLoading(collections);

  const [createCollectionOpen, setCreateCollectionOpen] = useState(false);

  const [createCollectionValues, setCreateCollectionValues] = useState({
    name: ""
  });

  const renderCollectionHeader = () => {
    const handleChange = name => event => {
      setCreateCollectionValues({
        ...createCollectionValues,
        [name]: event.target.value
      });
    };

    const handleOpen = () => {
      setCreateCollectionOpen(true);
    };

    const handleClose = () => {
      setCreateCollectionOpen(false);
      setCreateCollectionValues({});
    };

    const handleSubmit = async e => {
      e.preventDefault();

      await addDoc(["users", userId, "collections"], {
        name: createCollectionValues.name
      });
      setCreateCollectionOpen(false);
    };

    const renderCreateCollectionButton = () => {
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
          open={createCollectionOpen}
          onClose={handleClose}
          aria-labelledby="create-collection-dialog"
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>Create a collection</DialogTitle>
            <DialogContent>
              <DialogContentText>
                A collection is a personal group of series. Choose a name for
                your collection.
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
                disabled={!createCollectionValues.name}
              >
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      ];
    };

    return (
      <FrameHeader title="Collection">
        {renderCreateCollectionButton()}
      </FrameHeader>
    );
  };

  const renderCollection = (collection, i) => {
    return (
      <LinkRouter
        underline="none"
        key={collection.name}
        to={`${url}/collection/${encodeURIComponent(collection.name)}`}
      >
        <ListItem button>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary={collection.name}
            secondary={collection.length}
          />
          {/* <ListSubheader>
            <Typography>{collection.length}</Typography>
          </ListSubheader> */}
        </ListItem>
      </LinkRouter>
    );
  };

  const renderCollections = () => {
    return (
      <List aria-label="collections" className={classes.collectionList}>
        {collections.map(renderCollection)}
      </List>
    );
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header location={[params.user]} />
      {isLoading ? (
        <Loading />
      ) : (
        <Container maxWidth="md" className={classes.content}>
          <Frame maxWidth="lg" className={classes.collectionContainer}>
            {renderCollectionHeader()}
            {renderCollections()}
          </Frame>
        </Container>
      )}
    </Container>
  );
}
