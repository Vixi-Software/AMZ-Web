import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

import { useCallback } from "react";

export const useFirestore = (db, collectionName) => {
  const colRef = collection(db, collectionName);

  const getAllDocs = useCallback(async () => {
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }, [colRef]);

  const getDocById = useCallback(async (id) => {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }, [db, collectionName]);

  const addDocData = useCallback(async (data) => {
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }, [colRef]);

  const updateDocData = useCallback(async (id, data) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  }, [db, collectionName]);

  const deleteDocData = useCallback(async (id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }, [db, collectionName]);

  // Lấy tài liệu theo phân trang
  const getDocsByPage = useCallback(
    async ({ pageSize = 10, lastDoc = null, orderField = "name" }) => {
      let q = query(colRef, orderBy(orderField), limit(pageSize));
      if (lastDoc) {
        q = query(
          colRef,
          orderBy(orderField),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }
      const snapshot = await getDocs(q);
      return {
        docs: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    },
    [colRef]
  );

  return {
    getAllDocs,
    getDocById,
    addDocData,
    updateDocData,
    deleteDocData,
    getDocsByPage, // Thêm hàm mới vào return
  };
};