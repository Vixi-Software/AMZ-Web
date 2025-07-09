import React, { useEffect } from 'react'
import MainCarousel from '../../pages/Home/MainCarousel'
import { Card, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom';
import routePath from '../../constants/routePath';
import { usePostService } from '../../services/postService';
import CountSale from '../Home/CountSale';

function Exchange() {
  const navigate = useNavigate();

  const { getPostsWithStore } = usePostService()
  const [posts, setPosts] = React.useState([])

  useEffect(() => {
    // Lấy bài viết
    getPostsWithStore().then(posts => {
      setPosts(posts)
    })
    // eslint-disable-next-line
  }, [])



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
            {'Thu cũ đổi mới'}
          </span>
        </nav>
      </div>
      <MainCarousel />
      {/* Thông tin liên hệ và mô tả */}
      {/* <Row gutter={16} className="mb-4 mt-4">
        <Col xs={24} md={10}>
          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Card
                className="!bg-[#FFE8D3] !border-none !rounded-lg px-0 py-0 text-center"
                style={{ height: 74, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <div className="text-[16px] font-semibold text-[#FF6A00]">Thu cũ tại Hà Nội:</div>
                <div className="font-bold text-orange-500 text-[21px]">Zalo: 0333.571.236</div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                className="!bg-[#FFE8D3] !border-none !rounded-lg !p-[10px] text-center"
                style={{ height: 74, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <div className="text-[16px] font-semibold text-[#FF6A00]">Thu cũ Đà Nẵng:</div>
                <div className="font-bold text-orange-500 text-[21px]">Zalo: 0333.571.236</div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={14}>
          <div className="text-[16px] text-gray-700 leading-5 h-full flex items-center">
            <span className='text-center text-[16px] be-vietnam-pro-medium'> Giải pháp <b>tiết kiệm và tiện lợi</b> cho khách hàng có nhu cầu nâng cấp thiết bị. AMZ TECH cam kết <b>thu mua với giá cao</b>, đảm bảo quyền lợi tốt nhất cho khách hàng. Quy trình diễn ra <b>nhanh chóng</b>, bạn sẽ nhận được chi trả ngay lập tức hoặc bù trừ trực tiếp vào sản phẩm mới.</span>
          </div>
        </Col>
      </Row> */}

    <div className='mt-[20px]'>
        <CountSale  />
    </div>

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
    </div>
  )
}

export default Exchange