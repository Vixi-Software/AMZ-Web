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
import { handleProduct } from "../utils/productHandle";

export const useFirestore = (db, collectionName = "home") => {
  const colRef = collection(db, collectionName);

  const getAllDocs = useCallback(async () => {
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }, [colRef]);

  // const getDocById = useCallback(async (id) => {
  //   const docRef = doc(db, collectionName, id);
  //   const snapshot = await getDoc(docRef);
  //   return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  // }, [db, collectionName]);

  // const addDocData = useCallback(async (data) => {
  //   const docRef = await addDoc(colRef, data);
  //   return docRef.id;
  // }, [colRef]);

  // const updateDocData = useCallback(async (id, data) => {
  //   const docRef = doc(db, collectionName, id);
  //   await updateDoc(docRef, data);
  // }, [db, collectionName]);

  // const deleteDocData = useCallback(async (id) => {
  //   const docRef = doc(db, collectionName, id);
  //   await deleteDoc(docRef);
  // }, [db, collectionName]);

  // // Lấy tài liệu theo phân trang
  // const getDocsByPage = useCallback(
  //   async ({ pageSize = 10, lastDoc = null, orderField = "name" }) => {
  //     let q = query(colRef, orderBy(orderField), limit(pageSize));
  //     if (lastDoc) {
  //       q = query(
  //         colRef,
  //         orderBy(orderField),
  //         startAfter(lastDoc),
  //         limit(pageSize)
  //       );
  //     }
  //     const snapshot = await getDocs(q);
  //     return {
  //       docs: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //       lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  //     };
  //   },
  //   [colRef]
  // );

  const getAllDocsWithSubcollections = useCallback(
    async (collectionNames = []) => {
      const allProducts = [];

      for (const collectionName of collectionNames) {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);

        for (const docSnap of snapshot.docs) {
          const rawDoc = docSnap.data();

          for (const [key, value] of Object.entries(rawDoc)) {
            if (key === "id") continue;

            if (typeof value === "string") {
              // console.log(`📄 Raw string [${collectionName}/${key}]:`, value);

              const rawArray = value
                .split("|")
                .map((item) => (item === "null" ? "" : item.trim()));

              // Insert key as id at the beginning
              rawArray.unshift(key);

              // console.log("🔍 Parsed Array with ID:", rawArray);

              const product = handleProduct(rawArray);
              // console.log("✅ Handled Product:", product);

              allProducts.push(product);
            }
          }
        }
      }

      // console.log("🔥 All Products:", allProducts);
      return allProducts;
    },
    [db]
  );
  

  return {
    getAllDocsWithSubcollections,
    getAllDocs,
    // getDocById,
    // addDocData,
    // updateDocData,
    // deleteDocData,
    // getDocsByPage, // Thêm hàm mới vào return
  };
};