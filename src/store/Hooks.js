import { useEffect, useState } from "react";
import { useIsMounted } from "../utils/HookUtils";
import { isAnyNull } from "../utils/ObjectUtils";
import { onUserChange } from "./Firebase";
import { registerListener, registerListenerForIdByName } from "./Store";

export function useCurrentUser() {
  const isMounted = useIsMounted();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    return onUserChange(user => {
      if (!isMounted) {
        return;
      }

      setCurrentUser(user);
    });
  });

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
  const isMounted = useIsMounted();
  const [data, setData] = useState();

  useEffect(() => {
    if (isAnyNull(...ids)) {
      setData(null);
      return;
    }

    return registerListener(ids, data => {
      if (!isMounted) {
        return;
      }

      setData(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...ids, isMounted]);
  return data;
}

export function useUserId(username) {
  const isMounted = useIsMounted();
  const [userId, setUserId] = useState();

  useEffect(() => {
    return registerListenerForIdByName(["users"], username, id => {
      if (!isMounted) {
        return;
      }

      setUserId(id);
    });
  }, [isMounted, username]);

  return userId;
}

export function useCollectionId(username, collectionName) {
  const isMounted = useIsMounted();
  const userId = useUserId(username);

  const [collectionId, setCollectionId] = useState();

  useEffect(() => {
    if (isAnyNull(userId, collectionName)) {
      setCollectionId(null);
      return;
    }

    return registerListenerForIdByName(
      ["users", userId, "collections"],
      collectionName,
      id => {
        if (!isMounted) {
          return;
        }

        setCollectionId(id);
      }
    );
  }, [isMounted, userId, collectionName]);

  return collectionId;
}

export function useSeriesId(username, collectionName, seriesName) {
  const isMounted = useIsMounted();
  const userId = useUserId(username);
  const collectionId = useCollectionId(username, collectionName);

  const [seriesId, setSeriesId] = useState();

  useEffect(() => {
    if (isAnyNull(userId, collectionId, seriesName)) {
      setSeriesId(null);
      return;
    }

    return registerListenerForIdByName(
      ["users", userId, "collections", collectionId, "series"],
      seriesName,
      id => {
        if (!isMounted) {
          return;
        }

        setSeriesId(id);
      }
    );
  }, [isMounted, userId, collectionId, seriesName]);

  return seriesId;
}
