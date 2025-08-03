import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductGrid from '../../components/features/ProductGrid'
import { Grid } from 'antd'
import { usePostService } from '../../services/postService'
import { setCategory, setBrands, setPriceRanges } from '../../store/features/filterProduct/filterProductSlice'
import { useUrlParams } from '../../hooks/useUrlParams'

const { useBreakpoint } = Grid

const sortOptions = [
  { label: 'Bán chạy nhất', value: 'bestseller' },
  { label: 'Khuyến mãi hot', value: 'hotdeal' },
  { label: 'Giá tăng dần', value: 'asc' },
  { label: 'Giá giảm dần', value: 'desc' },
]

function Product() {
  const { getPostsWithStore } = usePostService();
  const [products, setProducts] = useState([])
  const [selectedSort, setSelectedSort] = useState('bestseller')
  const [posts, setPosts] = useState([])
  const { urlParams, updateUrlParams } = useUrlParams()
  const dispatch = useDispatch()
  const screens = useBreakpoint()
  const isSmall = !screens.md
  const isMedium = screens.md && !screens.lg
  const allProductsState = useSelector((state) => state.allProducts);
  
  // Sử dụng useMemo để tránh tính toán lại allProductsArray mỗi lần render
  const allProductsArray = useMemo(() => {
    return Object.values(allProductsState).flat();
  }, [allProductsState]);
  
  // Lấy parameters từ URL
  const { category: categoryFromUrl, brands: brandsFromUrl, priceRanges: priceRangesFromUrl, sort: sortFromUrl } = urlParams
  
  // Sử dụng useMemo để tối ưu filteredProduct
  const filteredProduct = useMemo(() => {
    if (categoryFromUrl !== "Tất cả sản phẩm") {
      return allProductsArray.filter(
        (product) => product.category === categoryFromUrl
      );
    }
    return allProductsArray;
  }, [allProductsArray, categoryFromUrl]);

  // Tối ưu hóa việc filter và sort products
  const processedProducts = useMemo(() => {
    const filtered = filteredProduct
      .filter(product => {
        // Filter by brand
        if (brandsFromUrl.length > 0 && !brandsFromUrl.includes(product.brand)) {
          return false;
        }
        
        // Filter by price range
        if (priceRangesFromUrl.length > 0) {
          const price = Number(product.priceForSale);
          const inRange = priceRangesFromUrl.some(([min, max]) => {
            const minPrice = Number(min) || 0;
            const maxPrice = max === Infinity || max === null ? Infinity : Number(max);
            return price >= minPrice && price <= maxPrice;
          });
          if (!inRange) return false;
        }
        
        return true;
      });

    // Sort products
    const sorted = [...filtered];
    switch (selectedSort) {
      case 'bestseller':
        sorted.sort((a, b) => {
          const aBest = a.isBestSeller === "1" ? 1 : 0;
          const bBest = b.isBestSeller === "1" ? 1 : 0;
          return bBest - aBest;
        });
        break;

      case 'hotdeal':
        sorted.sort((a, b) => {
          const aSale = Number(a.salePercent) || 0;
          const bSale = Number(b.salePercent) || 0;
          return bSale - aSale;
        });
        break;

      case 'asc':
        sorted.sort((a, b) => Number(a.priceForSale) - Number(b.priceForSale));
        break;

      case 'desc':
        sorted.sort((a, b) => Number(b.priceForSale) - Number(a.priceForSale));
        break;

      default:
        break;
    }

    return sorted;
  }, [filteredProduct, brandsFromUrl, priceRangesFromUrl, selectedSort]);

  const [loading, setLoading] = useState(false);

  // Cập nhật Redux store khi URL thay đổi
  useEffect(() => {
    dispatch(setCategory(categoryFromUrl))
    dispatch(setBrands(brandsFromUrl))
    dispatch(setPriceRanges(priceRangesFromUrl))
    setSelectedSort(sortFromUrl)
  }, [categoryFromUrl, brandsFromUrl, priceRangesFromUrl, sortFromUrl, dispatch])

  useEffect(() => {
    // Lấy bài viết một lần khi component mount
    getPostsWithStore().then(posts => {
      setPosts(posts)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty dependency array để chỉ chạy một lần
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(processedProducts);
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [processedProducts])

  const handleSortClick = (option) => {
    setSelectedSort(option.value)
    // Cập nhật URL với sort parameter
    updateUrlParams({ sort: option.value })
  }
  // Giả sử bạn có một mảng sản phẩm tên là products
  return (
    <div>
      <div
        className={
          `bg-[#FFFFFF] rounded-[10px] px-4 py-3 mb-4 flex items-center gap-3` +
          (isSmall ? ' flex-col items-start mt-3 gap-2' : '')
        }
      >
        {!(isSmall || isMedium) && (
          <span
            className={`font-medium text-[#222] mr-2  text-nowrap ${isSmall
              ? 'text-[16px] '
              : isMedium
                ? 'text-[14px]'
                : 'text-[20px]'
              }`}
          >
            Sắp xếp theo
          </span>
        )}
        <div className="flex gap-2 w-full overflow-x-auto">
          {sortOptions.map(option => (
            <button
              key={option.value}
              className={
                (selectedSort === option.value
                  ? "border border-[#D65312] text-[#D65312] bg-white font-medium focus:outline-none"
                  : "border border-[#e0e0e0] text-[#222] bg-white font-medium focus:outline-none hover:border-[#D65312]") +
                ` rounded-[10px] ${isSmall
                  ? 'p-1 text-[10px]'
                  : isMedium
                    ? 'px-1 py-1 text-[12px]'
                    : 'px-6 py-1 text-[20px]'
                }`
              }
              onClick={() => handleSortClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {products.length === 0 ? (
        <div>Không có sản phẩm phù hợp</div>
      ) : (
        loading ? (
          <div className="flex items-center justify-center w-full min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>

        ) : (
          <ProductGrid products={products} />
        )
      )}
      <div className='mt-[30px]'>
        {/* HIển thị bài viết */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
              <div key={post.id} className="rounded-lg">
                <h1 className="text-[21px] be-vietnam-pro-medium  font-semibold">{post.title}</h1>
                <div
                  className="text-gray-600 be-vietnam-pro"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div>Không có bài viết nào</div>
        )}
      </div>
      {/* <img src="https://drive.google.com/thumbnail?id=1qdwH07RgKpoo55w52Xwdre-fXyNa9G20" alt="Thumbnail" /> */}
    </div>
  )
}

export default Product
