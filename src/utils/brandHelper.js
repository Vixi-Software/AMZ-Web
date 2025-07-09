import { useFirestore } from "../hooks/useFirestore";

// Usage: const { getAllBrands, getBrandById, addBrand, updateBrand, deleteBrand } = useBrandHelper(db);
export const useBrandHelper = (db) => {
  const {
    getAllDocs: getAllBrands,
    getDocById: getBrandById,
    addDocData: addBrand,
    updateDocData: updateBrand,
    deleteDocData: deleteBrand,
  } = useFirestore(db, "brands");

  return {
    getAllBrands,
    getBrandById,
    addBrand,
    updateBrand,
    deleteBrand,
  };
};