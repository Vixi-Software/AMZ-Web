import { useFirestore } from "../hooks/useFirestore";
import { useSelector, useDispatch } from "react-redux";
import { setProduct, setRandomProducts, setProductData } from "../store/features/product/productSlice";
import { db } from "./firebase";
import { setBrands } from "../store/features/brand/brandSlice";

export const useProductHelper = () => {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productData);

  const {
    getAllDocs: getAllProductsFromFirebase,
    getDocById,
    addDocData: addProduct,
    updateDocData: updateProduct,
    deleteDocData: deleteProduct,
  } = useFirestore(db, "products");

  const PRODUCT_CACHE_KEY = "product_expiry_time";

  // Lấy tất cả sản phẩm, ưu tiên lấy từ store
  const getAllProducts = async () => {
    const now = Date.now();
    const expiry = localStorage.getItem(PRODUCT_CACHE_KEY);

    // Nếu chưa hết hạn và đã có dữ liệu trong store thì lấy từ store
    if (
      expiry &&
      Number(expiry) > now &&
      productData &&
      productData.length > 0
    ) {
      return productData;
    }

    // Nếu hết hạn hoặc chưa có dữ liệu thì lấy từ firebase
    const allProducts = await getAllProductsFromFirebase();
    if (allProducts && allProducts.length > 0) {
      dispatch(setProductData(allProducts));
      // Lưu thời gian hết hạn mới (hiện tại + 30 phút)
      const newExpiry = now + 30 * 60 * 1000;
      localStorage.setItem(PRODUCT_CACHE_KEY, newExpiry.toString());
    }
    return allProducts;
  };

  // Hàm lấy random sản phẩm theo số lượng và lưu vào redux
  const getRandomProducts = async (count) => {
    const allProducts = await getAllProducts();
    if (!allProducts || allProducts.length === 0) {
      dispatch(setRandomProducts([]));
      return [];
    }
    // Clone array before sorting to avoid mutating read-only state
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    const randomProducts = shuffled.slice(0, count);
    dispatch(setRandomProducts(randomProducts));
    return randomProducts;
  };

  // Hàm lấy sản phẩm theo id và lưu vào redux
  const getProductById = async (id) => {
    let product;
    if (productData && productData.length > 0) {
      product = productData.find((p) => p.id === id);
    }
    if (!product) {
      product = await getDocById(id);
    }
    if (product) {
      dispatch(setProduct(product));
    }
    return product;
  };

  const getProductsByCategory = async (categoryStr) => {
    const allProducts = await getAllProducts();
    if (!allProducts || allProducts.length === 0) return [];
    const filtered = allProducts.filter(
      (product) =>
        product.category &&
        product.category.toLowerCase().includes(categoryStr.toLowerCase())
    );
    return filtered;
  };

  const searchProductsByName = async (nameStr) => {
    const allProducts = await getAllProducts();
    if (!allProducts || allProducts.length === 0) return [];
    const filtered = allProducts.filter(
      (product) =>
        product.name &&
        product.name.toLowerCase().includes(nameStr.toLowerCase())
    );
    if (filtered.length === 0) {
      // Random 1 từ trong chuỗi nhập
      const words = nameStr.trim().split(/\s+/);
      if (words.length > 1) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomFiltered = allProducts.filter(
          (product) =>
            product.name &&
            product.name.toLowerCase().includes(randomWord.toLowerCase())
        );
        if (randomFiltered.length > 0) {
          return randomFiltered;
        }
      }
      // Không trả về rỗng hay allProducts, trả về N sản phẩm ngẫu nhiên
      const N = 5; // Số lượng sản phẩm muốn trả về
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      const randomProducts = shuffled.slice(0, Math.min(N, allProducts.length));
      return randomProducts;
    }
    return filtered;
  };

  // Lọc sản phẩm theo filter object
  const filterProducts = async (filter, sort = '') => {
    const allProducts = await getAllProducts();
    if (!allProducts || allProducts.length === 0) return [];

    // Lọc theo category (dùng includes)
    let filteredByCategory = allProducts;
    if (
      filter.category &&
      filter.category.trim() !== ""
    ) {
      filteredByCategory = allProducts.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase().includes(filter.category.toLowerCase())
      );
    }

    const brandsSet = new Set(
      filteredByCategory
        .filter((product) => product.brand)
        .map((product) => product.brand)
    );
    const brands = Array.from(brandsSet);
    dispatch(setBrands(brands)); 

    let filteredProducts = filteredByCategory.filter((product) => {
      if (
        filter.brands &&
        filter.brands.length > 0 &&
        (!product.brand ||
          !filter.brands.some(
            (b) => b.toLowerCase() === product.brand.toLowerCase()
          ))
      ) {
        return false;
      }

      // Lọc theo priceRanges
      if (
        filter.priceRanges &&
        filter.priceRanges.length > 0 &&
        (typeof product.Ban_Le_Value !== "number" ||
          !filter.priceRanges.some(
            ([min, max]) =>
              product.Ban_Le_Value >= min && product.Ban_Le_Value <= max
          ))
      ) {
        return false;
      }

      // Lọc theo needs (nếu có trường needs trong product)
      if (
        filter.needs &&
        filter.needs.length > 0 &&
        (!product.needs ||
          !filter.needs.every((need) =>
            product.needs
              ?.map((n) => n.toLowerCase())
              .includes(need.toLowerCase())
          ))
      ) {
        return false;
      }

      return true;
    });

    switch (sort) {
      case 'asc':
        filteredProducts = filteredProducts.sort((a, b) => a.Ban_Le_Value - b.Ban_Le_Value);
        break;
      case 'desc':
        filteredProducts = filteredProducts.sort((a, b) => b.Ban_Le_Value - a.Ban_Le_Value);
        break;
      case 'hotdeal':
        filteredProducts = filteredProducts.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case 'bestseller':
      default:
        filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
    }

    return filteredProducts;
  };

  return {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getRandomProducts,
    getProductsByCategory,
    searchProductsByName,
    filterProducts,
  };
};
