import * as config from "./config.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// add
export async function addDb(collec, data, converter) {
  try {
    await addDoc(collection(config.db, collec).withConverter(converter), data);
  } catch (error) {
    console.log(error);
  }
}

// get all
export async function getAllDb(collec, converter) {
  try {
    const q = query(collection(config.db, collec).withConverter(converter));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.log(error);
  }
}

// get document with query
export async function getDbByQuery(collec, queryObject, converter) {
  try {
    const q = query(
      collection(config.db, collec).withConverter(converter),
      where(queryObject.field, queryObject.operator, queryObject.value)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getDbByMultiQuery(collec, queries, converter) {
  try {
    // queries là một mảng các object: [{field, operator, value}, ...]
    const whereClauses = queries.map(q => where(q.field, q.operator, q.value));
    const q = query(
      collection(config.db, collec).withConverter(converter),
      ...whereClauses
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getDbById(collec, docId, converter) {
  try {
    const ref = doc(config.db, collec, docId).withConverter(converter);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

// update
export async function updateDb(collec, data, converter) {
  try {
    const ref = doc(config.db, collec, data.id).withConverter(converter);
    let result = await updateDoc(ref, converter.toFirestore(data));
    return result;
  } catch (error) {
    console.log(error);
  }
}