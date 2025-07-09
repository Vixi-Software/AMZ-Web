import { useFirestore } from "../hooks/useFirestore";

// Usage: const { getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory } = useCategoryHelper(db);
export const useColorHelper = (db) => {
  const {
    getAllDocs,
    getDocById,
    addDocData,
    updateDocData,
    deleteDocData,
  } = useFirestore(db, "colors");

  // CRUD wrappers for categories
  const getAllCategories = getAllDocs;
  const getCategoryById = getDocById;
  const addCategory = addDocData;
  const updateCategory = updateDocData;
  const deleteCategory = deleteDocData;

  return {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};