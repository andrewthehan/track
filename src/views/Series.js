import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Frame } from "../components/Frame";
import { FrameHeader } from "../components/FrameHeader";
import { Header } from "../components/Header";
import {
  useCollectionId,
  useData,
  useSeriesId,
  useUserId
} from "../store/Hooks";
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
  const { user, collection, series } = match.params;

  const classes = useStyles();

  const userId = useUserId(user);
  const collectionId = useCollectionId(user, collection);
  const seriesId = useSeriesId(user, collection, series);

  const seriesData = useData([
    "users",
    userId,
    "collections",
    collectionId,
    "series",
    seriesId
  ]);

  const renderSeriesHeader = () => {
    if (isAnyNull(seriesData)) {
      return null;
    }

    return (
      <FrameHeader title={seriesData.name}>
        <Typography>{seriesData.length}</Typography>
      </FrameHeader>
    );
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Header location={[user, collection, series]} />
      <Container maxWidth="md" className={classes.content}>
        <Frame maxWidth="lg" className={classes.seriesContainer}>
          {renderSeriesHeader()}
        </Frame>
      </Container>
    </Container>
  );
}
