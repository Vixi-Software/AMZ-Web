import { useEffect, useState } from 'react'
import { Card, Tag, Row, Col } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setProduct } from '../../store/features/product/productSlice'
import { setLoading } from '../../store/features/loading/loadingSlice'
import routePath from '../../constants/routePath'
import BestSellerIcon from '../../assets/ic-bestseller.png'

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSmall, setIsSmall] = useState(false);
  const [imageError, setImageError] = useState(false);

  const rawImages = product.images
  const imageArray = rawImages.split(";;")
  const cardImage = imageArray[0]

  const productName = product.name;
  const productColor = product.colors;
  const salePercent = product.salePercent;
  const priceForSale = Number(product.priceForSale).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const priceDefault = Number(product.priceDefault).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const condition = product.condition;

  useEffect(() => {
    const checkScreen = () => setIsSmall(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleCardClick = () => {
    dispatch(setProduct({ ...product }));
    navigate(routePath.productDetail);
  };

  const handleGiaThamKhaoClick = (e) => {
    e.stopPropagation();
    window.open('https://zalo.me/0333571236', '_blank');
  };

  const colorMap = {
    'Trắng': '#fff',
    'Đen': '#222',
    'Cam': '#FFA500',
    'Vàng': '#FFD700',
    'Xanh': '#1E90FF',
    'Xanh dương': '#1E90FF',
    'Xanh lá': '#32CD32',
    'Xanh lục': '#32CD32',
    'Xanh ngọc': '#00CED1',
    'Xanh navy': '#001F54',
    'Xanh rêu': '#556B2F',
    'Xanh pastel': '#A7FFEB',
    'Đỏ': '#FF0000',
    'Đỏ đô': '#8B0000',
    'Đỏ tươi': '#FF6347',
    'Hồng': '#FF69B4',
    'Hồng pastel': '#FFD1DC',
    'Tím': '#800080',
    'Tím pastel': '#D1B3FF',
    'Tím than': '#4B006E',
    'Xám': '#888',
    'Xám bạc': '#B0B0B0',
    'Xám lông chuột': '#A9A9A9',
    'Nâu': '#8B4513',
    'Nâu đất': '#A0522D',
    'Nâu nhạt': '#DEB887',
    'Bạc': '#C0C0C0',
    'Be': '#F5F5DC',
    'Vàng đồng': '#B8860B',
    'Vàng chanh': '#FFF700',
    'Vàng nhạt': '#FFFACD',
    'Cam đất': '#FF8C42',
    'Cam nhạt': '#FFDAB9',
    'Xanh mint': '#AAF0D1',
    'Xanh lam': '#4682B4',
    'Xanh biển': '#5F9EA0',
    'Xanh cốm': '#B2FF66',
    'Trắng ngà': '#FFFFF0',
    'Đen nhám': '#1A1A1A',
    'Đen bóng': '#333333',
    'Hồng nude': '#FADADD',
    'Hồng cam': '#FFB6B9',
    'Hồng đất': '#C08081',
    'Tím khói': '#B39EB5',
    'Xám xanh': '#7B8D8E',
    'Xám tro': '#BEBEBE',
    'Nâu đỏ': '#A0522D',
    'Nâu socola': '#381819',
  };

  return (
    <Card
      hoverable
      onClick={handleCardClick}
      className="w-full mb-4 !rounded-2xl flex flex-col flex-1 h-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
      styles={{
        body: {
          padding: isSmall ? 4 : '10px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }
      }}
      style={{
        boxShadow: '0 0 5px 2px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)',
      }}
      cover={
        <div style={{ position: 'relative', height: isSmall ? 200 : 350, minHeight: isSmall ? 200 : 350, maxHeight: isSmall ? 200 : 350, width: '100%' }}>
          {/* Tag overlay */}
          <div
            className="flex justify-between pt-3 px-3 bg-transparent z-2"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              width: '100%'
            }}
          >
            <div>
              {salePercent > 0 && (
                <Tag
                  color="#FFE8D3"
                  className="font-bold rounded-lg"
                  style={{
                    borderRadius: '10px',
                    padding: isSmall ? '2px 4px' : '4px 10px',
                    color: '#D65312',
                    fontSize: isSmall ? 10 : 14
                  }}
                >
                  Giảm {salePercent}%
                </Tag>
              )}
            </div>
            <div>
              <Tag
                color="#ffffff"
                className="font-medium rounded-lg py-1 px-2 border"
                style={{
                  color: '#D65312',
                  padding: isSmall ? '2px 4px' : '4px 10px',
                  borderRadius: '10px',
                  borderColor: '#FF9231',
                  fontSize: isSmall ? 10 : 14
                }}
              >
                {condition}
              </Tag>
            </div>
          </div>
          {/* Image */}
          {product.images ? (
            <img
              alt={productName}
              src={cardImage}
              className="w-full h-full object-cover rounded"
              style={{ width: '100%', height: isSmall ? 200 : 350, minHeight: isSmall ? 200 : 350, maxHeight: isSmall ? 200 : 350, borderRadius: '10px', objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center text-gray-500" style={{ height: isSmall ? 200 : 350, minHeight: isSmall ? 200 : 350, maxHeight: isSmall ? 200 : 350 }}>
              Ảnh chưa được cập nhật
            </div>
          )}

          {product.isBestSeller === "1" && (
            <img
              src={BestSellerIcon} // Hoặc BestSellerBadge nếu bạn dùng icon khác
              alt="Best Seller"
              style={{
                position: 'absolute',
                bottom: -50,
                right: 10,
                width: 120,
                height: 120,
                zIndex: 3,
                objectFit: 'contain'
              }}
            />
          )}
        </div>
      }
    >
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between gap-1">
          {/* phần trái */}
          <div>
            <div className="be-vietnam-pro-medium text-sm sm:text-[16px] mb-1 flex items-center gap-1">
              {product.isBestSeller === "1" && (
                <span style={{ fontSize: 16 }}>🔥</span>
              )}
              {productName}
            </div>
            <div className="font-bold text-base sm:text-[21px] text-[#D65312] leading-none">
              {salePercent > 0 ? (
                <>
                  {/* Giá đã giảm */}
                  {priceForSale}
                  {/* Giá gốc bị gạch ngang */}
                  <span className="be-vietnam-pro-light text-xs sm:text-base text-[#aaa] ml-1 line-through">
                    {priceForSale}
                  </span>
                </>
              ) : (
                <>
                  {/* Giá bình thường */}
                  {priceForSale && priceForSale}
                  {/* Nếu có priceDefault thì hiển thị gạch ngang */}
                  {priceDefault && (
                    <span className="be-vietnam-pro-extrabold text-xs sm:text-[11px] text-[#aaa] ml-2 line-through">
                      {priceDefault}
                    </span>
                  )}
                </>
              )}
            </div>
            <div
              className="text-[#888] text-sm mt-1 cursor-pointer no-underline"
              onClick={handleGiaThamKhaoClick}
            >
              Giá tham khảo. Chi tiết xin liên hệ zalo
            </div>
          </div>
          {/* phần phải */}
          <div className="flex flex-col gap-1 items-center relative group">
            {/* Hiển thị tối đa 3 dot màu */}
            <div className="flex flex-col gap-1 items-center">
              {(Array.isArray(productColor) ? productColor : [productColor])
                .filter(Boolean)
                .slice(0, 3)
                .map((color) => (
                  <span
                    key={color}
                    title={color}
                    className="inline-block w-4 h-4 rounded-full border border-[#ddd]"
                    style={{
                      background: colorMap[color] || '#ccc',
                    }}
                  />
                ))}
              
              {/* Hiển thị indicator nếu có nhiều hơn 3 màu */}
              {(Array.isArray(productColor) ? productColor : [productColor]).filter(Boolean).length > 3 && (
                <span className="text-xs text-[#888] group-hover:hidden">
                  +{(Array.isArray(productColor) ? productColor : [productColor]).filter(Boolean).length - 3}
                </span>
              )}
            </div>

            {/* Hiển thị tất cả dots khi hover */}
            {(Array.isArray(productColor) ? productColor : [productColor]).filter(Boolean).length > 3 && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1 items-center border border-gray-200 min-w-[60px]" 
                style={{ 
                  zIndex: 9999,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                }}>
                {(Array.isArray(productColor) ? productColor : [productColor]).filter(Boolean).map((color) => (
                  <span
                    key={color}
                    title={color}
                    className="inline-block w-4 h-4 rounded-full border border-[#ddd]"
                    style={{
                      background: colorMap[color] || '#ccc',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard
