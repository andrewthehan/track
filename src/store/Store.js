import { db } from "./Firebase";

export function isDoc(ids) {
  return ids.length % 2 === 0;
}

export function checkIsDoc(ids) {
  if (!isDoc(ids)) {
    throw new Error(`Tried to find a doc with an invalid id path: ${ids}`);
  }
}

export function checkIsCollection(ids) {
  if (isDoc(ids)) {
    throw new Error(
      `Tried to find a collection with an invalid id path: ${ids}`
    );
  }
}

export function getRef(ids) {
  return ids.reduce(
    (ref, id, i) => (i % 2 === 0 ? ref.collection(id) : ref.doc(id)),
    db
  );
}

export async function registerListener(ids, callback) {
  return await getRef(ids).onSnapshot(
    isDoc(ids)
      ? d => callback(d.data())
      : c => callback(c.docs.map(d => d.data()))
  );
}

export async function getDoc(ids) {
  checkIsDoc(ids);

  return await getRef(ids).get();
}

export async function addDoc(ids, data) {
  checkIsCollection(ids);

  await getRef(ids).add(data);
}

export async function setDoc(ids, data) {
  checkIsDoc(ids);

  await getRef(ids).set(data);
}

export async function findByName(ids, name) {
  checkIsCollection(ids);

  const ref = await getRef(ids)
    .where("name", "==", name)
    .get();

  if (ref.empty) {
    return null;
  }
  if (ref.docs.length > 1) {
    throw new Error(`Found more than 1 doc with name: ${name}`);
  }

  return ref.docs[0];
}
