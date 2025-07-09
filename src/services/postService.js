import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/features/postServices/postServiceSlice";
import { useFirestore } from "../hooks/useFirestore";
import { db } from "../utils/firebase";

const collectionName = "postService";
const PAGE_SIZE = 10;
const ORDER_FIELD = "createdAt";
const TIME_EXPIRATION = 30 * 1000; 
const LAST_FETCHED_KEY = "posts_last_fetched";

export const usePostService = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postService.posts);

  const getLastFetched = () => {
    const value = localStorage.getItem(LAST_FETCHED_KEY);
    return value ? parseInt(value, 10) : null;
  };

  const setLastFetched = (timestamp) => {
    localStorage.setItem(LAST_FETCHED_KEY, timestamp.toString());
  };

  const {
    getAllDocs,
    getDocById,
    addDocData,
    updateDocData,
    deleteDocData,
    getDocsByPage,
  } = useFirestore(db, collectionName);

  const getAllPosts = async () => {
    return await getAllDocs();
  };

  const getPostById = async (id) => {
    return await getDocById(id);
  };

  const addPost = async (data) => {
    return await addDocData(data);
  };

  const updatePost = async (id, data) => {
    await updateDocData(id, data);
  };

  const deletePost = async (id) => {
    await deleteDocData(id);
  };

  const getPostsByPage = async ({ pageSize = PAGE_SIZE, lastDoc = null, orderField = ORDER_FIELD }) => {
    return await getDocsByPage({ pageSize, lastDoc, orderField });
  };

  const getPostsWithStore = async () => {
    const now = Date.now();
    const lastFetched = getLastFetched();
    if (
      posts.length > 0 &&
      lastFetched &&
      now - lastFetched < TIME_EXPIRATION
    ) {
      return posts;
    }
    const allPosts = await getAllPosts();
    dispatch(setPosts(allPosts));
    setLastFetched(now);
    return allPosts;
  };

  return {
    getAllPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost,
    getPostsByPage,
    getPostsWithStore
    };
}
    