import { useState } from 'react'
import { Row, Col, Button, Grid } from 'antd' 
import ProductCard from './ProductCard'
import routePath from '../../constants/routePath';

const { useBreakpoint } = Grid; 

function BannerCol({ image }) {
  return (
    <Col xs={24} sm={24} md={24} lg={16}>
      <div
        className="transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
        style={{
          width: '100%',
          display: 'flex',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <img
          src={image}
          alt="Banner"
          style={{
            width: '100%',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
        />
      </div>
    </Col>
  );
}

function ProductGrid({ products, banners = [], title , buttons = [], activeCategory }) {
  const screens = useBreakpoint(); 
  const location = window.location.pathname;
  const isProductPage = location.includes(routePath.product);
  const isNewSearchPage = location.includes(routePath.newSeal);
  const [visibleCount, setVisibleCount] = useState(
    isProductPage || isNewSearchPage ? 9 : 8
  ); // Hiển thị 9 nếu là product hoặc newsearch, ngược lại 8
  const increment = 18;
  const visibleProducts = products.slice(0, visibleCount);

  const items = [];
  let productIdx = 0;

  for (let i = 0; i < visibleProducts.length + banners.length; i++) {
    const banner = banners.find(b => b.index === i);
    if (banner && screens.lg) {
      items.push(
        <BannerCol key={`banner-${i}`} image={banner.image} />
      );
    } else if (productIdx < visibleProducts.length) {
      items.push(
        <Col key={visibleProducts[productIdx].id} xs={12} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
          <ProductCard product={visibleProducts[productIdx]} />
        </Col>
      );
      productIdx++;
    }
  }

  return (
    <div
      className={
        screens.lg
          ? 'p-5 bg-white rounded-lg shadow-md'
          : screens.sm
          ? 'p-0 rounded-lg shadow-md'
          : 'p-0  rounded-lg shadow-md'
      }
    >
      {(title || (buttons && buttons.length > 0)) && (
        <div className='flex justify-between items-center mb-4'>
          <div>
            {title && screens.lg && (
              <h2 className="text-2xl font-bold mb-0">{title}</h2>
            )}
          </div>
          {(buttons && buttons.length > 0) && (
            <div className="flex gap-2 ml-auto">
              {buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  type="default"
                  size={btn.size || "large"}
                  className={
                    "!font-semibold " +
                    (activeCategory === btn.category
                      ? "!bg-[#D65312] !text-white"
                      : "!bg-white !text-[#D65312] border-[#D65312]")
                  }
                  onClick={btn.onClick}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
      <Row gutter={[16, 16]} align="stretch" style={{ display: 'flex', flexWrap: 'wrap', borderRadius: '8px', background: '#fafafa' }}>
        {items}
        {visibleCount < products.length && (
          <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginTop: 16, padding: '16px 0' }}>
            <Button type="default" className='!font-semibold !border-1 !border-[#999999] hover:!text-orange-500' size="large" onClick={() => setVisibleCount((prev) => Math.min(prev + increment, products.length))}>
              Xem thêm
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default ProductGrid
