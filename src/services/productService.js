import { useDispatch, useSelector } from "react-redux";
import { setProducts, setProductSelected } from "../store/features/productServices/productServiceSlice";
import { useFirestore } from "../hooks/useFirestore";
import { db } from "../utils/firebase";
import React from "react";
import Fuse from 'fuse.js';

const collectionName = "productStore";
const PAGE_SIZE = 10;
const ORDER_FIELD = "name";
const TIME_EXPIRATION = 30 * 1000;
const LAST_FETCHED_KEY = "products_last_fetched";

export const useProductService = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productService.products);
  const selectorFull = useSelector((state) => state.allData.data);
  const productSelected = useSelector((state) => state.productService.productSelected);

  const {
    getAllDocs,
    getDocById,
    addDocData,
    updateDocData,
    deleteDocData,
    getDocsByPage,
  } = useFirestore(db, collectionName);

  const getAllProducts = async () => {
    return await getAllDocs();
  };

  const getProductById = async (id) => {
    return await getDocById(id);
  };

  const addProduct = async (data) => {
    return await addDocData(data);
  };

  const updateProduct = async (id, data) => {
    await updateDocData(id, data);
  };

  const deleteProduct = async (id) => {
    await deleteDocData(id);
  };

  const getProductsByPage = async ({ pageSize = PAGE_SIZE, lastDoc = null, orderField = ORDER_FIELD }) => {
    return await getDocsByPage({ pageSize, lastDoc, orderField });
  };

  const getProductsWithStore = async () => {
    const allProducts = selectorFull;
    // const allProducts = await getAllDocs();
    dispatch(setProducts(allProducts));
    return allProducts;
  };

  // Lấy sản phẩm theo danh mục (tìm kiếm gần đúng, không phân biệt hoa thường)
  const getProductsByCategory = async (category) => {
    const allProducts = await getProductsWithStore();
    const lowerCategory = category.toLowerCase();
    return allProducts.filter((product) =>
      product.category && product.category.toLowerCase().includes(lowerCategory)
    );
  };

  // Lấy sản phẩm theo tên (tìm kiếm gần đúng, không phân biệt hoa thường)
  const getProductsByName = async (name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return [];
    }

    const allProducts = await getProductsWithStore();
    const fuse = new Fuse(allProducts, {
      keys: ['name'], // tìm theo field name
      threshold: 0.5, // độ fuzzy, càng thấp càng chính xác
      ignoreLocation: true,
    });

    return fuse.search(name).map(result => result.item);
  };

  const getFinalPrice = (product) => {
    if (product.salePrice && product.pricesBanLe) {
      return product.pricesBanLe - (product.pricesBanLe * product.salePrice) / 100;
    }
    return product.pricesBanLe || 0;
  };

  const filterProduct = async (filter = {}, sort = '') => {
    const allProducts = await getProductsWithStore();

    // const countByCategory = allProducts.reduce((acc, product) => {
    //   const category = product.category?.toLowerCase() || 'unknown';
    //   acc[category] = (acc[category] || 0) + 1;
    //   return acc;
    // }, {});
    // console.log('Số lượng sản phẩm theo category:', countByCategory);

    if (!allProducts || allProducts.length === 0) return [];

    let filteredProducts = allProducts.filter((product) => {
      // Lọc theo category
      if (
        filter.category &&
        filter.category.trim() !== "" &&
        (!product.category ||
          !product.category.toLowerCase().includes(filter.category.toLowerCase()))

      ) {
        return false;
      }
      // Lọc theo brands
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
        Array.isArray(filter.priceRanges) &&
        filter.priceRanges.length > 0
      ) {
        const price = getFinalPrice(product);
        if (
          !filter.priceRanges.some(
            (range) =>
              Array.isArray(range) &&
              range.length === 2 &&
              price >= range[0] &&
              price <= range[1]
          )
        ) {
          return false;
        }
      }

      // Lọc theo needs
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

      // Lọc theo statusSell
      if (
        filter.statusSell &&
        filter.statusSell.trim() !== "" &&
        (!product.statusSell ||
          !product.statusSell
            .map((s) => s.toLowerCase())
            .includes(filter.statusSell.toLowerCase()))
      ) {
        return false;
      }

      return true;
    });

    // Nếu là bestseller/hotdeal và có lọc giá thì chỉ lọc lại theo giá
    if (
      (sort === 'bestseller' || sort === 'hotdeal') &&
      Array.isArray(filter.priceRanges) &&
      filter.priceRanges.length > 0
    ) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = getFinalPrice(product);
        return filter.priceRanges.some(
          (range) =>
            Array.isArray(range) &&
            range.length === 2 &&
            price >= range[0] &&
            price <= range[1]
        );
      });
      return filteredProducts;
    }

    // Sắp xếp
    switch (sort) {
      case 'asc':
        filteredProducts.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
        break;
      case 'desc':
        filteredProducts.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
        break;
      case 'hotdeal':
        filteredProducts.sort((a, b) => {
          const aHasSale = !!a.salePrice;
          const bHasSale = !!b.salePrice;
          if (aHasSale !== bHasSale) return bHasSale - aHasSale;
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        });
        break;
      case 'bestseller':
        filteredProducts.sort((a, b) => (b.isbestSeller === true) - (a.isbestSeller === true));
        break;
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
    }

    return filteredProducts;
  };

  // Lấy sản phẩm theo id từ store, nếu có thì lưu vào store.productEdit
  const getProductByIdFromStore = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      dispatch(setProductSelected(product));
    }
    return product;
  };

  // Lấy 4 sản phẩm liên quan cùng category (random, loại trừ chính sản phẩm)
  const getRelatedProductsByCategory = async () => {
    const allProducts = await getProductsWithStore();
    const mainProduct = productSelected;
    if (!mainProduct || !mainProduct.id || !mainProduct.category) return [];
    const category = mainProduct.category.toLowerCase();
    // Lọc các sản phẩm cùng category, loại trừ chính nó
    const related = allProducts.filter(p =>
      p.id !== mainProduct.id &&
      p.category && p.category.toLowerCase() === category
    );
    // Trộn ngẫu nhiên
    for (let i = related.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [related[i], related[j]] = [related[j], related[i]];
    }
    return related.slice(0, 4);
  };

  return {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByPage,
    getProductsWithStore,
    getProductsByCategory,
    getProductsByName,
    filterProduct,
    getProductByIdFromStore,
    getRelatedProductsByCategory,
  };
}
