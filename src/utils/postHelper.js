import { useFirestore } from "../hooks/useFirestore";
import { db } from "./firebase";

const COLLECTION = "posts";

export const usePostHelper = () => {
  const {
    getAllDocs,
    getDocById,
    addDocData,
    updateDocData,
    deleteDocData,
  } = useFirestore(db, COLLECTION);

  // CRUD wrappers for posts
  const getAllPosts = getAllDocs;
  const getPostById = getDocById;
  const addPost = addDocData;
  const updatePost = updateDocData;
  const deletePost = deleteDocData;

  return {
    getAllPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost,
  };
};