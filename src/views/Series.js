import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { FormDialog } from "../components/FormDialog";
import { Frame } from "../components/Frame";
import { FrameHeader } from "../components/FrameHeader";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import {
  useCollectionId,
  useData,
  useIsOwner,
  useSeriesId,
  useUserId,
} from "../store/Hooks";
import { deleteDoc, setDoc } from "../store/Store";
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
  },
  metadataContainer: {
    flex: 1,
    height: "100%",
  },
  metadataContent: {
    padding: "16px",
  },
  gridItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export function Series() {
  const classes = useStyles();

  const history = useHistory();
  const params = useParams();

  params.user = decodeURIComponent(params.user);
  params.collection = decodeURIComponent(params.collection);
  params.series = decodeURIComponent(params.series);

  const userId = useUserId(params.user);
  const collectionId = useCollectionId(params.user, params.collection);
  const seriesId = useSeriesId(params.user, params.collection, params.series);

  const ids = [
    "users",
    userId,
    "collections",
    collectionId,
    "series",
    seriesId,
  ];
  const series = useData(ids);

  const isLoading = isAnyNull(seriesId, series);
  const isOwner = useIsOwner(userId);

  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    if (isAnyNull(series)) {
      return;
    }

    setEditValues(series);
  }, [series]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const renderSeriesHeader = () => {
    const renderDeleteSeriesButton = () => {
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
        history.push(`/user/${params.user}/collection/${params.collection}`);
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
          title={`Are you sure you want to delete ${series.name}?`}
          description="This action cannot be undone!"
          action={handleDelete}
          open={deleteDialogOpen}
          onClose={handleClose}
          submitText="Delete"
        ></FormDialog>,
      ];
    };

    return (
      <FrameHeader title="Metadata">{renderDeleteSeriesButton()}</FrameHeader>
    );
  };

  const renderSeriesData = () => {
    const handleChange = (name) => (event) => {
      setEditValues({
        ...editValues,
        [name]: event.target.value,
      });
    };

    const handleMetadataSubmit = async (e) => {
      e.preventDefault();

      if (!areStringsEqual(series.name, editValues.name)) {
        history.push(
          `/user/${params.user}/collection/${params.collection}/series/${editValues.name}`
        );
      }

      await setDoc(ids, {
        name: editValues.name,
        length: editValues.length,
        status: editValues.status,
      });
    };

    return (
      <form onSubmit={handleMetadataSubmit}>
        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={2}
          className={classes.metadataContent}
        >
          <Grid item xs={12} className={classes.gridItem}>
            <TextField
              autoFocus
              required
              fullWidth
              label="Name"
              value={editValues.name || ""}
              onChange={handleChange("name")}
              disabled={!isOwner}
            />
          </Grid>
          <Grid item xs={6} className={classes.gridItem}>
            <TextField
              required
              fullWidth
              label="Length"
              type="number"
              value={editValues.length || ""}
              onChange={handleChange("length")}
              disabled={!isOwner}
            />
          </Grid>
          <Grid item xs={6} className={classes.gridItem}>
            <TextField
              required
              select
              fullWidth
              label="Status"
              value={editValues.status || ""}
              onChange={handleChange("status")}
              disabled={!isOwner}
            >
              <MenuItem value="Incomplete">Incomplete</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={
                areStringsEqual(series.name, editValues.name) &&
                series.length === editValues.length &&
                areStringsEqual(series.status, editValues.status)
              }
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header location={[params.user, params.collection, params.series]} />
      {isLoading ? (
        <Loading />
      ) : (
        <Container maxWidth="sm" className={classes.content}>
          <Frame maxWidth="lg" className={classes.metadataContainer}>
            {renderSeriesHeader()}
            {renderSeriesData()}
          </Frame>
        </Container>
      )}
    </Container>
  );
}
