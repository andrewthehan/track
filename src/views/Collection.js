import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  InsertDriveFile as InsertDriveFileIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
  PostAdd as PostAddIcon
} from "@material-ui/icons";
import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { FormDialog } from "../components/FormDialog";
import { Frame } from "../components/Frame";
import { FrameHeader } from "../components/FrameHeader";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import {
  useCollectionId,
  useData,
  useIsOwner,
  useUserId
} from "../store/Hooks";
import { addDoc, deleteDoc, setDoc } from "../store/Store";
import { isAnyNull } from "../utils/ObjectUtils";

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
  },
  seriesLengthContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

export function Collection() {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const userId = useUserId(params.user);
  const collectionId = useCollectionId(params.user, params.collection);

  const ids = ["users", userId, "collections", collectionId];
  const collection = useData(ids);
  const series = useData([...ids, "series"]);

  const isLoading = isAnyNull(collection, series);
  const isOwner = useIsOwner(userId);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogValues, setCreateDialogValues] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const renderSeriesHeader = () => {
    const handleChange = name => event => {
      setCreateDialogValues({
        ...createDialogValues,
        [name]: event.target.value
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
      if (series.some(s => s.name === name)) {
        throw new ErrorIcon(
          `Failed to create series because series with name ${name} already exists!`
        );
      }

      await addDoc(["users", userId, "collections", collectionId, "series"], {
        name,
        length: 0,
        status: "Incomplete"
      });
      setCreateDialogOpen(false);
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
        <FormDialog
          key="dialog"
          title={`Create a series`}
          description="A series is a personal entry in a collection. Choose a name for your series."
          action={handleSubmit}
          open={createDialogOpen}
          onClose={handleClose}
          submitText="Create"
          submitDisabled={
            !createDialogValues.name ||
            !createDialogValues.name.trim() ||
            series.some(s => s.name === createDialogValues.name.trim())
          }
        >
          <TextField
            required
            autoFocus
            fullWidth
            label="Name"
            onChange={handleChange("name")}
          />
        </FormDialog>
      ];
    };

    const renderDeleteCollectionButton = () => {
      if (!isOwner) {
        return null;
      }

      const handleOpen = () => {
        setDeleteDialogOpen(true);
      };

      const handleClose = () => {
        setDeleteDialogOpen(false);
      };

      const handleDelete = async () => {
        history.push(`/user/${params.user}`);
        await deleteDoc(ids);
      };

      return [
        <IconButton
          key="button"
          color="inherit"
          aria-label="delete"
          onClick={handleOpen}
        >
          <DeleteIcon />
        </IconButton>,
        <FormDialog
          key="modal"
          title={`Are you sure you want to delete ${collection.name}?`}
          description="This action cannot be undone!"
          action={handleDelete}
          open={deleteDialogOpen}
          onClose={handleClose}
          submitText="Delete"
        ></FormDialog>
      ];
    };

    return (
      <FrameHeader title="Series">
        {renderCreateSeriesButton()}
        {renderDeleteCollectionButton()}
      </FrameHeader>
    );
  };

  const renderSeries = (series, i) => {
    const renderSeriesStatusIcon = status => {
      switch (status) {
        case "Complete":
          return <InsertDriveFileIcon />;
        case "Incomplete":
          return <InsertDriveFileOutlinedIcon />;
        default:
          return <ErrorIcon />;
      }
    };

    const handleSeriesClick = () => {
      history.push(
        `${location.pathname}/series/${encodeURIComponent(series.name)}`
      );
    };

    const handleSeriesIncrement = async () => {
      await setDoc([...ids, "series", series.id], {
        ...series,
        length: +series.length + 1
      });
    };

    const handleSeriesDecrement = async () => {
      await setDoc([...ids, "series", series.id], {
        ...series,
        length: +series.length - 1
      });
    };

    return (
      <ListItem key={series.id} button onClick={handleSeriesClick}>
        <ListItemIcon>{renderSeriesStatusIcon(series.status)}</ListItemIcon>
        <ListItemText primary={series.name} secondary={series.length} />
        <ListItemSecondaryAction className={classes.seriesLengthContainer}>
          {/* <ButtonGroup aria-label="split button"> */}
          <IconButton variant="outlined" onClick={handleSeriesIncrement}>
            <ArrowDropUpIcon />
          </IconButton>
          <IconButton variant="outlined" onClick={handleSeriesDecrement}>
            <ArrowDropDownIcon />
          </IconButton>
          {/* </ButtonGroup> */}
        </ListItemSecondaryAction>
      </ListItem>
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
