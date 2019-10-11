import { useEffect, useState } from "react";
import { isAnyNull } from "../utils/ObjectUtils";
import { onUserChange } from "./Firebase";
import { findByName, registerListener } from "./Store";

export function useAsyncEffect(f, deps) {
  useEffect(() => {
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useIsLoading(...objects) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isAnyNull(...objects));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, objects);

  return isLoading;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    return onUserChange(setCurrentUser);
  }, []);

  return currentUser;
}

export function useIsOwner(userId) {
  const currentUser = useCurrentUser();

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (isAnyNull(userId, currentUser)) {
      setIsOwner(false);
      return;
    }

    setIsOwner(currentUser.uid === userId);
  }, [currentUser, userId]);

  return isOwner;
}

export function useData(ids) {
  const [data, setData] = useState();
  useAsyncEffect(async () => {
    if (isAnyNull(...ids)) {
      setData(null);
      return;
    }

    await registerListener(ids, setData);
  }, ids);
  return data;
}

export function useUserId(username) {
  const [userId, setUserId] = useState();

  useAsyncEffect(async () => {
    if (isAnyNull(username)) {
      setUserId(null);
      return;
    }

    const user = await findByName(["users"], username);

    if (isAnyNull(user)) {
      setUserId(null);
      return;
    }

    setUserId(user.id);
  }, [username]);

  return userId;
}

export function useCollectionId(username, collectionName) {
  const userId = useUserId(username);

  const [collectionId, setCollectionId] = useState();

  useAsyncEffect(async () => {
    if (isAnyNull(userId, collectionName)) {
      setCollectionId(null);
      return;
    }

    const collection = await findByName(
      ["users", userId, "collections"],
      collectionName
    );

    if (isAnyNull(collection)) {
      setCollectionId(null);
      return;
    }

    setCollectionId(collection.id);
  }, [userId, collectionName]);

  return collectionId;
}

export function useSeriesId(username, collectionName, seriesName) {
  const userId = useUserId(username);
  const collectionId = useCollectionId(username, collectionName);

  const [seriesId, setSeriesId] = useState();

  useAsyncEffect(async () => {
    if (isAnyNull(userId, collectionId, seriesName)) {
      setSeriesId(null);
      return;
    }

    const series = await findByName(
      ["users", userId, "collections", collectionId, "series"],
      seriesName
    );

    if (isAnyNull(series)) {
      setSeriesId(null);
      return;
    }

    setSeriesId(series.id);
  }, [userId, collectionId, seriesName]);

  return seriesId;
}
