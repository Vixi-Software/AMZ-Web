import React, { useEffect, useState, useMemo } from "react";
import { useProductService } from "../../services/productService";
import ProductGrid from "../../components/features/ProductGrid";
import SideBarProduct from "../../components/features/SideBarProduct";
import { Col, Grid, Row, Carousel, ConfigProvider } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Footer from "../../components/features/Footer";
import { useNavigate } from "react-router-dom";
import routePath from "../../constants/routePath";
import { usePostService } from "../../services/postService";
import { useSelector } from "react-redux";

const CustomArrow = ({ className, style, onClick, direction }) => (
  <div
    className={`${className} custom-arrow`}
    style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      zIndex: 2,
      opacity: 0,
      transition: 'opacity 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    }}
    onClick={onClick}
  >
    {direction === 'prev' ? <LeftOutlined style={{ color: '#333' }} /> : <RightOutlined style={{ color: '#333' }} />}
  </div>
);

const sortOptions = [
  { label: 'Bán chạy nhất', value: 'bestseller' },
  { label: 'Khuyến mãi hot', value: 'hotdeal' },
  { label: 'Giá tăng dần', value: 'asc' },
  { label: 'Giá giảm dần', value: 'desc' },
]

const NewSeal = () => {
  const { getProductsWithStore } = useProductService();
  const { getPostsWithStore } = usePostService();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [], priceRanges: [] });
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedSort, setSelectedSort] = useState('bestseller')
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const allProductsState = useSelector((state) => state.allProducts);
  const allProductsArray = Object.values(allProductsState).flat();
  const isSmall = !screens.md
  const isMedium = screens.md && !screens.lg

  const handleSortClick = (option) => {
    setSelectedSort(option.value)
  }

  // Carousel images for NewSeal page
  const carouselImages = [
    {
      src: "https://chauaudio.com/cdn/images/tin-tuc/loa-marshall-la-thuong-hieu-nuoc-nao-phu-hop-voi-nhung-ai-5.jpg",
      alt: "new-seal-carousel-1"
    },
    {
      src: "https://th.bing.com/th/id/R.b1c51812c16cb5d4d84dabec2e75265d?rik=1t0PlY8a%2b649rA&pid=ImgRaw&r=0",
      alt: "new-seal-carousel-2"
    },
    {
      src: "https://th.bing.com/th/id/OIP.skBzSDoI0713daeCX87n4QHaEK?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
      alt: "new-seal-carousel-3"
    }
  ];

  useEffect(() => {
    let isMounted = true;

    // Get posts
    getPostsWithStore().then((posts) => {
      if (isMounted) {
        setPosts(posts);
      }
    });

    const fetchProducts = async () => {
      try {
        
        setProducts(
          allProductsArray.filter(
            (item) => item.condition === "New Seal"
          )
        );
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setProducts([]);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const brandsByCategory = Array.from(
    new Set(products.map((item) => item.brand).filter(Boolean))
  );

  const handleFilterChange = React.useCallback(
    ({ brands, priceRanges }) => {
      setFilters({ brands, priceRanges });
    },
    []
  );

  const filteredProducts = useMemo(() => {
    // Lọc theo brand và price như cũ
    let result = products.filter((product) => {
      const matchBrand =
        filters.brands.length === 0 ||
        filters.brands.includes(product.brand);

      const matchPrice =
        filters.priceRanges.length === 0 ||
        filters.priceRanges.some(([min, max]) => {
          const productPrice = product.priceForSale || 0;
          if (max === Infinity) {
            return productPrice >= min;
          }
          return productPrice >= min && productPrice < max;
        });

      return matchBrand && matchPrice;
    });

    // Sắp xếp theo selectedSort
    switch (selectedSort) {
      case 'bestseller':
        // Sản phẩm bán chạy nhất lên đầu (isbestSeller === true)
        result = result.slice().sort((a, b) => (b.isbestSeller === true) - (a.isbestSeller === true));
        break;
      case 'hotdeal':
        // Sản phẩm có salePrice lớn hơn 0 lên đầu, giảm dần theo salePrice
        result = result.slice().sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0));
        break;
      case 'asc':
        // Giá tăng dần
        result = result.slice().sort((a, b) => (a.priceForSale || 0) - (b.priceForSale || 0));
        break;
      case 'desc':
        // Giá giảm dần
        result = result.slice().sort((a, b) => (b.priceForSale || 0) - (a.priceForSale || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, selectedSort]);

  return (
    <div>
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-sm">
          {/* Home icon */}
          <span className="flex items-center gap-1 text-black border-2 p-2 rounded-full border-black cursor-pointer" onClick={() => navigate(routePath.home)}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M3 10.75L12 4l9 6.75" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.5 10.75V19a1 1 0 001 1h3.5v-4.25a1 1 0 011-1h2a1 1 0 011 1V20H18.5a1 1 0 001-1v-8.25" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Trang chủ</span>
          </span>

          {/* Divider */}
          <span className="mx-1 text-black">{'>'}</span>
          {/* Product name */}
          <span className="flex items-center gap-1 bg-orange-500 text-white font-semibold p-2 rounded-full border-2 border-orange-500 cursor-pointer">
            {'Hàng new seal'}
          </span>
        </nav>
      </div>

      {/* Carousel Section */}
      <Row>
        <Col span={24}>
          <ConfigProvider
            theme={{
              components: {
                Carousel: {
                  arrowSize: 0,
                  arrowOffset: 24,
                },
              },
            }}
          >
            <div className="carousel-container group mb-4">
              <Carousel 
                autoplay 
                arrows 
                prevArrow={<CustomArrow direction="prev" />}
                nextArrow={<CustomArrow direction="next" />}
                className="product-carousel"
              >
                {carouselImages.map((img, idx) => (
                  <div key={idx} className="carousel-image-container">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={`
                        w-full object-cover rounded-lg carousel-image
                        ${screens.lg ? 'h-[350px]' : screens.md ? 'h-[250px]' : 'h-[180px]'}
                      `}
                    />
                  </div>
                ))}
              </Carousel>
              <style jsx>{`
                .carousel-container {
                  position: relative;
                }
                
                .carousel-container .custom-arrow {
                  opacity: 0;
                  transform: scale(0.8);
                  transition: all 0.3s ease;
                }
                
                .carousel-container:hover .custom-arrow {
                  opacity: 1 !important;
                  transform: scale(1);
                }

                .carousel-image-container {
                  overflow: hidden;
                  border-radius: 8px;
                }

                .carousel-image {
                  transition: transform 0.5s ease-in-out;
                  cursor: pointer;
                }

                .carousel-image:hover {
                  transform: scale(1.05);
                }
              `}</style>
            </div>
          </ConfigProvider>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={6} md={7} lg={5}>
          {screens.sm && (
            <div className={`bg-white rounded-lg p-4 shadow-lg transition-shadow duration-300 hover:shadow-2xl`}>
              <SideBarProduct
                brands={brandsByCategory}
                priceRanges={[
                  { value: [0, 1000000], label: 'Dưới 1 triệu đồng' },
                  { value: [1000000, 2000000], label: 'Từ 1 triệu - 2 triệu' },
                  { value: [2000000, 3000000], label: 'Từ 2 triệu - 3 triệu' },
                  { value: [3000000, 5000000], label: 'Từ 3 triệu - 5 triệu' },
                  { value: [5000000, Infinity], label: 'Trên 5 triệu' },
                ]}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </Col>
        <Col xs={24} sm={18} md={17} lg={19}>
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
          <ProductGrid products={filteredProducts} />
          <div className='mt-[30px]'>
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
          <Footer />
        </Col>
      </Row>
    </div>
  );
};

export default NewSeal;