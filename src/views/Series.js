import { IconButton, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
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
  useUserId
} from "../store/Hooks";
import { deleteDoc } from "../store/Store";
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
  collectionContainer: {
    flex: 1,
    height: "100%"
  }
}));

export function Series({ match }) {
  const classes = useStyles();

  const history = useHistory();
  const params = useParams();

  const userId = useUserId(params.user);
  const collectionId = useCollectionId(params.user, params.collection);
  const seriesId = useSeriesId(params.user, params.collection, params.series);

  const ids = [
    "users",
    userId,
    "collections",
    collectionId,
    "series",
    seriesId
  ];
  const series = useData(ids);

  const isLoading = isAnyNull(seriesId, series);
  const isOwner = useIsOwner(userId);

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
        ></FormDialog>
      ];
    };

    return (
      <FrameHeader title={series.name}>
        {renderDeleteSeriesButton()}
      </FrameHeader>
    );
  };

  const renderSeriesData = () => {
    return (
      <Container maxWidth="md">
        <Typography variant="h6">Length</Typography>
        <Typography variant="body1">{series.length}</Typography>

        <Typography variant="h6">Status</Typography>
        <Typography variant="body1">{series.status}</Typography>
      </Container>
    );
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header location={[params.user, params.collection, params.series]} />
      {isLoading ? (
        <Loading />
      ) : (
        <Container maxWidth="md" className={classes.content}>
          <Frame maxWidth="lg" className={classes.seriesContainer}>
            {renderSeriesHeader()}
            {renderSeriesData()}
          </Frame>
        </Container>
      )}
    </Container>
  );
}
