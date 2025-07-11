import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ProductGrid from '../../components/features/ProductGrid'
import Loading from '../../components/features/Loading'
import { Grid } from 'antd'
import { useProductService } from '../../services/productService'
import { usePostService } from '../../services/postService'

import { selectBrands, selectCategory, selectPriceRanges } from '../../store/features/filterProduct/filterProductSlice'

const { useBreakpoint } = Grid

const sortOptions = [
  { label: 'Bán chạy nhất', value: 'bestseller' },
  { label: 'Khuyến mãi hot', value: 'hotdeal' },
  { label: 'Giá tăng dần', value: 'asc' },
  { label: 'Giá giảm dần', value: 'desc' },
]

function Product() {
  // const { filterProduct } = useProductService() 
  const { getPostsWithStore } = usePostService();
  const [products, setProducts] = useState([])
  const [selectedSort, setSelectedSort] = useState('bestseller')
  const [posts, setPosts] = useState([])
  const filteredProducts = useSelector(state => state.filterProduct)
  const screens = useBreakpoint()
  const isSmall = !screens.md
  const isMedium = screens.md && !screens.lg
  const allProductsState = useSelector((state) => state.allProducts);
  const allProductsArray = Object.values(allProductsState).flat();
  const category = useSelector(selectCategory);
  const filteredProduct = allProductsArray.filter(
    (product) => product.category === category
  );
  const brands = useSelector(selectBrands);
  const priceRanges = useSelector(selectPriceRanges);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy bài viết
    getPostsWithStore().then(posts => {
      setPosts(posts)
    })
    setProducts(filteredProduct)
  }, [])
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // console.log(brands, priceRanges)
      const filtered = filteredProduct
        // Filter by brand
        .filter(product => {
          if (brands.length === 0) return true;
          return brands.includes(product.brand);
        })
        // Filter by price range
        .filter(product => {
          if (priceRanges.length === 0) return true;
          const price = Number(product.priceForSale);
          return priceRanges.some(([min, max]) => price >= min && price <= max);
        });
      let sorted = [...filtered];
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

      setProducts(sorted);
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [brands, priceRanges, selectedSort])

  const handleSortClick = (option) => {
    setSelectedSort(option.value)
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
