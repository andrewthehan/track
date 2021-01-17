import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  InsertDriveFile as InsertDriveFileIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
  PostAdd as PostAddIcon,
} from "@material-ui/icons";
import React, { forwardRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { Virtuoso } from "react-virtuoso";
import { FormDialog } from "../components/FormDialog";
import { Frame } from "../components/Frame";
import { FrameHeader } from "../components/FrameHeader";
import { Header } from "../components/Header";
import { LinkRouter } from "../components/LinkRouter";
import { Loading } from "../components/Loading";
import {
  useCollectionId,
  useData,
  useIsOwner,
  useUserId,
} from "../store/Hooks";
import { addDoc, deleteDoc, setDoc } from "../store/Store";
import { sortStringsBy } from "../utils/ArrayUtils";
import { areStringsEqual, isAnyNull } from "../utils/ObjectUtils";

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
  seriesContainer: {
    flex: 1,
    height: "100%",
  },
  seriesHeaderTitle: {
    flex: 1,
  },
  seriesList: {
    flex: 1,
    height: 640,
  },
  seriesLengthContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export function Collection() {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  params.user = decodeURIComponent(params.user);
  params.collection = decodeURIComponent(params.collection);

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

  const [searchQuery, setSearchQuery] = useState("");

  const createSearchFilter = (searchQuery) => {
    if (isAnyNull(searchQuery) || searchQuery.length === 0) {
      return () => true;
    }

    return searchQuery
      .match(/"([^"]*)"|(\S+)/g)
      .map((searchItem) => {
        if (searchItem.startsWith("name:")) {
          const name = searchItem.substring("name:".length);
          return (s) => s.name.toLowerCase().includes(name.toLowerCase());
        } else if (searchItem.startsWith("status:")) {
          const status = searchItem.substring("status:".length);
          return (s) =>
            areStringsEqual(s.status.toLowerCase(), status.toLowerCase());
        } else if (searchItem.startsWith("minLength:")) {
          const minLength = searchItem.substring("minLength:".length);
          return (s) => s.length >= minLength;
        } else if (searchItem.startsWith("maxLength:")) {
          const maxLength = searchItem.substring("maxLength:".length);
          return (s) => s.length <= maxLength;
        } else {
          if (searchItem.startsWith(`"`) && searchItem.endsWith(`"`)) {
            searchItem = searchItem.slice(1, -1);
          }
          return (s) => s.name.toLowerCase().includes(searchItem.toLowerCase());
        }
      })
      .reduce(
        (a, x) => (s) => x(s) && a(s),
        (s) => true
      );
  };

  const seriesToRender = isAnyNull(series)
    ? []
    : series
        .filter(createSearchFilter(searchQuery))
        .sort(sortStringsBy((s) => s.name));

  const renderSeriesHeader = () => {
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
      if (series.some((s) => s.name === name)) {
        throw new ErrorIcon(
          `Failed to create series because series with name ${name} already exists!`
        );
      }

      await addDoc(["users", userId, "collections", collectionId, "series"], {
        name,
        length: 0,
        status: "Incomplete",
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
            series.some((s) => s.name === createDialogValues.name.trim())
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
        ></FormDialog>,
      ];
    };

    return (
      <FrameHeader
        title={`Series (${seriesToRender.length})`}
        onSearch={setSearchQuery}
      >
        {renderCreateSeriesButton()}
        {renderDeleteCollectionButton()}
      </FrameHeader>
    );
  };

  const renderSeries = (series) => {
    const renderSeriesStatusIcon = (status) => {
      switch (status) {
        case "Complete":
          return <InsertDriveFileIcon />;
        case "Incomplete":
          return <InsertDriveFileOutlinedIcon />;
        default:
          return <ErrorIcon />;
      }
    };

    const handleSeriesIncrement = async () => {
      await setDoc([...ids, "series", series.id], {
        ...series,
        length: Math.floor(+series.length + 1),
      });
    };

    const handleSeriesDecrement = async () => {
      await setDoc([...ids, "series", series.id], {
        ...series,
        length: Math.ceil(+series.length - 1),
      });
    };

    const link = `${location.pathname}/series/${encodeURIComponent(
      series.name
    )}`;

    return (
      <ListItem
        button
        component={forwardRef((props, ref) => (
          <LinkRouter to={link} {...props} innerRef={ref} />
        ))}
      >
        <ListItemIcon>{renderSeriesStatusIcon(series.status)}</ListItemIcon>
        <ListItemText primary={series.name} secondary={series.length} />
        {isOwner ? (
          <ListItemSecondaryAction className={classes.seriesLengthContainer}>
            <IconButton variant="outlined" onClick={handleSeriesIncrement}>
              <ArrowDropUpIcon />
            </IconButton>
            <IconButton variant="outlined" onClick={handleSeriesDecrement}>
              <ArrowDropDownIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    );
  };

  const renderSeriesList = () => {
    const renderEmptySeries = () => {
      if (series.length !== 0) {
        return null;
      }

      return (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isOwner ? (
            <Typography align="center" color="textSecondary">
              Press <PostAddIcon /> to add the first entry.
            </Typography>
          ) : (
            <Typography align="center" color="textSecondary">
              Empty
            </Typography>
          )}
        </div>
      );
    };

    const WrappedList = forwardRef((props, ref) => (
      <List className={classes.seriesList} {...props} ref={ref} />
    ));

    return (
      <Virtuoso
        aria-label="series"
        components={{
          EmptyPlaceholder: renderEmptySeries,
          List: WrappedList,
        }}
        totalCount={seriesToRender.length}
        computeItemKey={(i) => seriesToRender[i].id}
        itemContent={(i) => renderSeries(seriesToRender[i])}
      />
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
