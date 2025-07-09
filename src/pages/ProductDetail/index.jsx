import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Grid, Skeleton } from 'antd'
import { useNavigate } from 'react-router-dom'
import routePath from '../../constants/routePath'
import Breadcum from '../../components/features/Breadcum'
import { setCategory, resetFilter } from '../../store/features/filterProduct/filterProductSlice'
import ProductCard from '../../components/features/ProductCard'
import getGoogleDriveThumbnail from '../../utils/googleDriveImage'
import { useProductService } from '../../services/productService'
import { usePostService } from '../../services/postService'

function ProductDetail() {
  const product = useSelector(state => state.product.product)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [posts, setPosts] = useState([])
  const { getRelatedProductsByCategory } = useProductService()
  const { getPostsWithStore } = usePostService()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { md } = Grid.useBreakpoint()
  const isSmall = !md



  const [selectedOptions, setSelectedOptions] = useState({
    color: null,
    condition: null,
    branch: null
  })
  const [loading, setLoading] = useState(true)

  // Thêm hook để lấy tiêu đề YouTube động
  const [youtubeTitle, setYoutubeTitle] = useState('Video đánh giá loa')
  // Lấy videoUrl từ product, fallback nếu không có
  const videoUrl = product?.videoUrl || 'https://www.youtube.com/watch?v=hwsKMrkCalE'
  // Hàm lấy videoId từ url
  function extractYoutubeVideoId(url) {
    const match = url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([\w-]{11})/)
    return match ? match[1] : null
  }
  const youtubeVideoId = extractYoutubeVideoId(videoUrl)
  useEffect(() => {
    async function fetchYoutubeTitle() {
      if (!youtubeVideoId) {
        setYoutubeTitle('Video đánh giá loa')
        return
      }
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeVideoId}&format=json`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setYoutubeTitle(data.title || 'Video đánh giá loa')
      } catch {
        setYoutubeTitle('Video đánh giá loa')
      }
    }
    fetchYoutubeTitle()
  }, [youtubeVideoId])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [product])

  useEffect(() => {
    const fetchRelated = async () => {
      const related = await getRelatedProductsByCategory()
      setRelatedProducts(related)
    }
    fetchRelated()
  }, [product])

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getPostsWithStore()
      setPosts(allPosts)
    }
    fetchPosts()
  }, [])

  const handleSelectOption = (type, value) => {
    setSelectedOptions(prev => {
      const isSame = prev[type] === value
      return { ...prev, [type]: isSame ? null : value }
    })
  }

  function getThirdPart(name) {
    if (!name) return ''
    const parts = name.split(' - ')
    return parts.length >= 3 ? parts[2] : name
  }

  // --- SỬA ĐỔI DỮ LIỆU ĐẦU VÀO CHO PHÙ HỢP ---
  const rawImages = product?.images || product?.image || []
  const images = Array.isArray(rawImages)
    ? rawImages.map(img => getGoogleDriveThumbnail(img))
    : [getGoogleDriveThumbnail(rawImages)]
  const colors = product?.colors || product?.color || []
  const price = (product?.pricesBanLe * (100 - product?.salePrice)) / 100 || product?.Ban_Le_Value
  const priceOld = product?.pricesBanLe || product?.Ban_Le
  const productCondition = product?.statusSell?.[0]

  if (!product) {
    return (
      <div>
        <h2>Product Detail</h2>
        <p>Không có sản phẩm nào được chọn.</p>
      </div>
    )
  }

  return (
    <div>
      <Breadcum
        content={[
          {
            label: (
              <>
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ display: 'inline', verticalAlign: 'middle' }}
                >
                  <path
                    d="M3 10.75L12 4l9 6.75"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.5 10.75V19a1 1 0 001 1h3.5v-4.25a1 1 0 011-1h2a1 1 0 011 1V20H18.5a1 1 0 001-1v-8.25"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-1">Trang chủ</span>
              </>
            ),
            onClick: () => navigate(routePath.home)
          },
          {
            label: product.category || 'Danh mục',
            onClick: () => {
              dispatch(resetFilter())
              dispatch(setCategory(product.category))
              navigate(routePath.product)
            }
          },
          {
            label: getThirdPart(product.name),
            onClick: () => { },
            active: true
          }
        ]}
      />
      <h2 className="m-0 font-bold text-2xl mb-5">
        {loading ? (
          <Skeleton.Input active size="default" style={{ width: 200 }} />
        ) : (
          getThirdPart(product.name)
        )}
      </h2>
      <Row gutter={24}>
        <Col xs={24} md={14}>
          <div
            className="flex flex-col lg:flex-row gap-5 text-white rounded-lg p-8 mb-4 md:animate-shake"
            style={{
              background:
                'linear-gradient(135deg, #FF8F2Ccc 0%, #FF9231b3 60%, #FFD8B0cc 100%)'
            }}
          >
            <div className="w-full md:w-[300px] h-[250px] bg-gray-200 rounded-xl mb-4 lg:mb-0 flex items-center justify-center overflow-hidden">
              {loading ? (
                <Skeleton.Image style={{ width: 300, height: 250 }} active />
              ) : Array.isArray(images) && images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="rounded-lg object-cover w-full h-full transition-all duration-300 hover:scale-110 hover:brightness-110 cursor-pointer"
                />
              ) : (
                <span className="text-gray-300">No Image</span>
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <div className="!font-semibold !text-[21px] mb-2 text-center lg:text-center">
                TÍNH NĂNG NỔI BẬT
              </div>
              <ul className="m-0 pl-4 pr-4 list-none text-justify">
                {loading ? (
                  Array(4)
                    .fill(0)
                    .map((_, idx) => (
                      <li key={idx} className="mb-2">
                        <Skeleton.Input
                          active
                          size="small"
                          style={{ width: 200 }}
                        />
                      </li>
                    ))
                ) : product.highlights ? (
                  product.highlights.split('\n').map((line, idx) => (
                    <li key={idx} className="mb-2">
                      {line}
                    </li>
                  ))
                ) : (
                  <li className="mb-2">Chưa cập nhật tính năng nổi bật...</li>
                )}
              </ul>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {loading
              ? Array(3)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton.Image
                    key={idx}
                    style={{ width: 60, height: 60 }}
                    active
                  />
                ))
              : Array.isArray(images) &&
              images.length > 1 &&
              images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`border ${selectedImage === idx
                    ? 'border-orange-500'
                    : 'border-gray-300'
                    } rounded-md p-0.5 cursor-pointer w-30 h-30 bg-white flex items-center justify-center box-border transition-all duration-200 hover:shadow-lg hover:scale-105`}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover rounded transition-all duration-200 hover:brightness-110"
                  />
                </div>
              ))}
          </div>
        </Col>

        <Col xs={24} md={10}>
          <div className="flex items-baseline gap-4 mb-4">
            <span
              className={`text-orange-600 font-bold ${isSmall ? 'text-[24px]' : 'text-[50px]'
                }`}
            >
              {loading ? (
                <Skeleton.Input active size="large" style={{ width: 120 }} />
              ) : (
                `${price?.toLocaleString('vi-VN')} ₫`
              )}
            </span>
            <span
              className={`text-gray-300 line-through ${isSmall ? 'text-[14px]' : 'text-[28px]'
                }`}
            >
              {loading ? (
                <Skeleton.Input
                  active
                  size="default"
                  style={{ width: 80 }}
                />
              ) : priceOld ? (
                priceOld.toLocaleString('vi-VN')
              ) : (
                ''
              )}
            </span>
          </div>

          {/* Color Options */}
          <div className="mb-3">
            <div className="font-semibold mb-1">Màu sắc</div>
            <div className="flex gap-2">
              {loading
                ? Array(2)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton.Button
                      key={idx}
                      active
                      size="small"
                      style={{ width: 60 }}
                    />
                  ))
                : (Array.isArray(colors) ? colors : [colors]).map(
                  (color, idx) => (
                    <span
                      key={idx}
                      className={`rounded-md px-4 py-1 font-medium cursor-pointer border transition-colors duration-150 ${selectedOptions.color === color
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-800 border-gray-300'
                        }`}
                      style={{ minWidth: 60, display: 'inline-block', textAlign: 'center' }}
                      onClick={() => handleSelectOption('color', color)}
                    >
                      {color}
                    </span>
                  )
                )}
            </div>
          </div>

          {/* Condition Options */}
          <div className="mb-3">
            <div className="font-semibold mb-1">Tình trạng</div>
            <div className="flex gap-2">
              {loading ? (
                <Skeleton.Button
                  active
                  size="small"
                  style={{ width: 80 }}
                />
              ) : (
                <span
                  className={`rounded-md px-4 py-1 font-medium cursor-pointer border transition-colors duration-150 ${selectedOptions.condition === productCondition
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-[#999999]'
                    }`}
                  style={{ minWidth: 80, display: 'inline-block', textAlign: 'center' }}
                  onClick={() => handleSelectOption('condition', productCondition)}
                >
                  {productCondition}
                </span>
              )}
            </div>
          </div>

          {/* Stock Info */}
          <div className="mb-3">
            <div className="font-semibold mb-1">Chi nhánh mua hàng</div>
            <div className="flex gap-4">
              {loading
                ? Array(2)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton.Button
                      key={idx}
                      active
                      size="large"
                      style={{ width: 120, height: 60 }}
                    />
                  ))
                : (
                  <>
                    <div
                      className={`rounded-lg p-2 text-center cursor-pointer ${selectedOptions.branch === 'HÀ NỘI'
                        ? 'bg-orange-500 text-white border'
                        : 'border border-[#999999] bg-white'
                        }`}
                      onClick={() => handleSelectOption('branch', 'HÀ NỘI')}
                    >
                      <div className="font-semibold">HÀ NỘI</div>
                      <div className="font-semibold">Zalo: 0333.571.236</div>
                    </div>
                    <div
                      className={`rounded-lg p-2 text-center cursor-pointer ${selectedOptions.branch === 'ĐÀ NẴNG'
                        ? 'bg-orange-500 text-white border'
                        : 'border border-[#999999] bg-white'
                        }`}
                      onClick={() => handleSelectOption('branch', 'ĐÀ NẴNG')}
                    >
                      <div className="font-semibold">ĐÀ NẴNG</div>
                      <div className="font-semibold">Zalo: 0935.241.243</div>
                    </div>
                  </>
                )}
            </div>
          </div>
        </Col>
      </Row>

      <h1>Sản phẩm tương tự</h1>
      <div>
        <Row gutter={24}>
          {loading
            ? Array(4)
              .fill(0)
              .map((_, idx) => (
                <Col xs={24} md={8} lg={6} key={idx} className="mt-4">
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Col>
              ))
            : relatedProducts.map((item, idx) => (
              <Col xs={24} md={8} lg={6} key={item.id || idx} className="mt-4">
                <ProductCard
                  product={item}
                  onClickCard={() => setLoading(true)}
                />
              </Col>
            ))}
        </Row>
      </div>

      <Row gutter={24} className="mt-8">
        <Col xs={24} md={15} className="bg-white py-4">
          <div className="text-black text-base mb-2 bg-gray-200 p-3 rounded-md">
            <h3 className="text-lg text-orange-400 text-center font-semibold mb-2">
              Mô tả sản phẩm
            </h3>
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              !product.description ||
              product.description.trim().toLowerCase() === 'null' ? (
                'Chưa cập nhật mô tả sản phẩm...'
              ) : (
                product.description
              )
            )}
          </div>
        </Col>
        <Col xs={24} md={9}>
          <div className="bg-white rounded-lg shadow-lg">
            {loading ? (
              <Skeleton
                active
                paragraph={{
                  rows: 8,
                  width: ['60%', '40%', '50%', '70%', '60%', '50%', '40%', '60%']
                }}
              />
            ) : (
              (() => {
                const rows = parseTableInfo(product.tableInfo)
                if (
                  !rows.length ||
                  (rows.length === 1 && !rows[0].key && !rows[0].value)
                ) {
                  return <div className='p-2'>Chưa cập nhật thông tin sản phẩm...</div>
                }
                return (
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'separate',
                      borderSpacing: 0,
                      borderRadius: 6,
                      overflow: 'hidden',
                      background: '#fff',
                      boxShadow: '4px 4px 4px 0 rgba(0,0,0,0.25)'
                    }}
                  >
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr
                          key={idx}
                          style={{
                            background: idx % 2 === 0 ? '#ECECEC' : '#fff'
                          }}
                        >
                          <td
                            style={{
                              fontWeight: 'bold',
                              padding: '6px 10px', // giảm padding
                              border: 'none',
                              fontSize: 16
                            }}
                          >
                            {row.key}
                          </td>
                          <td
                            style={{
                              minWidth: 200,
                              padding: '6px 10px',
                              border: 'none',
                              fontSize: 16
                            }}
                          >
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              })()
            )}
          </div>

          {/* Hiển thị video YouTube */}
          {product?.videoUrl && (
            <div className="mt-6 flex justify-center">
              <div className="bg-white rounded-lg shadow-lg flex flex-col items-center p-4 gap-4 w-full max-w-[560px] mx-auto">
                {/* Tiêu đề nằm trên và dọc toàn bộ card */}
                <span className="text-2xl font-semibold text-orange-500 block mb-2 w-full">Video đánh giá sản phẩm</span>
                <div className="flex flex-col md:flex-row items-center w-full gap-4">
                  {/* Video bên trái */}
                  <div style={{ width: 220, minWidth: 200, maxWidth: 220 }}>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <iframe
                        src={
                          youtubeVideoId
                            ? `https://www.youtube.com/embed/${youtubeVideoId}`
                            : 'https://www.youtube.com/embed/hwsKMrkCalE'
                        }
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      />
                    </div>
                  </div>
                  {/* Chữ bên phải */}
                  <div className="flex-1 flex h-full mt-4 md:mt-0">
                    <span className="text-xl font-semibold">{youtubeTitle.length > 100 ? youtubeTitle.slice(0, 100) + '...' : youtubeTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>

      <Row className='bg-white px-4 mt-8' >
        <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Bài viết liên quan</h2>
        {posts && posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post, idx) => (
              <div key={post.id || idx} className="transition">
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <div className="text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: post.content }} />
                {/* Nếu có ảnh */}
                {post.image && (
                  <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded mb-2" />
                )}
                {/* Có thể thêm nút xem chi tiết nếu muốn */}
              </div>
            ))}
          </div>
        ) : (
          <div>Không có bài viết nào.</div>
        )}
      </div>
      </Row>
    </div>
  )
}

function parseTableInfo(html) {
  if (!html) return [{ key: '', value: '' }]
  const rowRegex = /<tr.*?>(.*?)<\/tr>/g
  const cellRegex = /<td.*?>(.*?)<\/td>/g
  const rows = []
  let rowMatch
  while ((rowMatch = rowRegex.exec(html))) {
    const cells = []
    let cellMatch
    while ((cellMatch = cellRegex.exec(rowMatch[1]))) {
      const text = cellMatch[1].replace(/<.*?>/g, '').trim()
      cells.push(text)
    }
    if (cells.length === 2) {
      rows.push({ key: cells[0], value: cells[1] })
    }
  }
  return rows.length ? rows : [{ key: '', value: '' }]
}

export default ProductDetail