import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Folder as FolderIcon,
  PostAdd as PostAddIcon,
} from "@material-ui/icons";
import React, { forwardRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { FormDialog } from "../components/FormDialog";
import { Frame } from "../components/Frame";
import { FrameHeader } from "../components/FrameHeader";
import { Header } from "../components/Header";
import { LinkRouter } from "../components/LinkRouter";
import { Loading } from "../components/Loading";
import { useData, useIsOwner, useUserId } from "../store/Hooks";
import { addDoc } from "../store/Store";
import { sortStringsBy } from "../utils/ArrayUtils";
import { isAnyNull } from "../utils/ObjectUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    height: "100%",
    display: "flex",
    flexFlow: "column",
  },
  content: {
    marginTop: "48px",
    padding: "24px",
    display: "flex",
    flexFlow: "row",
    justifyContent: "center",
  },
  collectionContainer: {
    flex: 1,
    height: "100%",
  },
  collectionList: {
    flex: 1,
  },
}));

export function Profile() {
  const classes = useStyles();

  const location = useLocation();
  const params = useParams();

  params.user = decodeURIComponent(params.user);

  const userId = useUserId(params.user);

  const user = useData(["users", userId]);
  const collections = useData(["users", userId, "collections"]);

  const isLoading = isAnyNull(user, collections);
  const isOwner = useIsOwner(userId);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogValues, setCreateDialogValues] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  const renderCollectionHeader = () => {
    const handleChange = (name) => (event) => {
      setCreateDialogValues({
        ...createDialogValues,
        [name]: event.target.value,
      });
    };

    const handleOpen = () => {
      setCreateDialogOpen(true);
    };

    const handleClose = () => {
      setCreateDialogOpen(false);
      setCreateDialogValues({});
    };

    const handleSubmit = async () => {
      const name = createDialogValues.name.trim();
      if (collections.some((c) => c.name === name)) {
        throw new Error(
          `Failed to create collection because collection with name ${name} already exists!`
        );
      }

      await addDoc(["users", userId, "collections"], { name });
      setCreateDialogOpen(false);
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
        <FormDialog
          key="dialog"
          title={`Create a collection`}
          description="A collection is a personal group of series. Choose a name for
          your collection."
          action={handleSubmit}
          open={createDialogOpen}
          onClose={handleClose}
          submitText="Create"
          submitDisabled={
            !createDialogValues.name ||
            !createDialogValues.name.trim() ||
            collections.some((c) => c.name === createDialogValues.name.trim())
          }
        >
          <TextField
            required
            autoFocus
            fullWidth
            label="Name"
            onChange={handleChange("name")}
          />
        </FormDialog>,
      ];
    };

    return (
      <FrameHeader title="Collections" onSearch={setSearchQuery}>
        {renderCreateCollectionButton()}
      </FrameHeader>
    );
  };

  const renderCollection = (collection) => {
    const link = `${location.pathname}/collection/${encodeURIComponent(
      collection.name
    )}`;

    return (
      <ListItem
        key={collection.id}
        button
        component={forwardRef((props, ref) => (
          <LinkRouter to={link} {...props} innerRef={ref} />
        ))}
      >
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={collection.name} />
      </ListItem>
    );
  };

  const renderCollections = () => {
    const renderEmptyCollection = () => {
      if (collections.length !== 0) {
        return null;
      }

      return isOwner ? (
        <Typography align="center" color="textSecondary">
          Press <PostAddIcon /> to add the first entry.
        </Typography>
      ) : (
        <Typography align="center" color="textSecondary">
          Empty
        </Typography>
      );
    };

    return (
      <List aria-label="collections" className={classes.collectionList}>
        {renderEmptyCollection()}
        {collections
          .sort(sortStringsBy((c) => c.name))
          .filter(
            (c) =>
              searchQuery.length === 0 ||
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(renderCollection)}
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
