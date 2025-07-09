import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Input, Button, Typography, Space, Drawer, AutoComplete, Dropdown, Menu, Grid } from 'antd'
import { MenuOutlined, SearchOutlined, EnvironmentOutlined, PhoneOutlined, ThunderboltOutlined, DollarCircleOutlined, HeartOutlined, ClockCircleOutlined, TruckOutlined } from '@ant-design/icons'
import { setProduct } from '../../store/features/product/productSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import routePath from '../../constants/routePath'
import AMZLogo from '../../assets/amzLogo.jpg'
import images from '../../utils/images'
import { setCategory } from '../../store/features/filterProduct/filterProductSlice'
import SideBarProduct from './SideBarProduct'
import { useProductService } from '../../services/productService'
const { Text, Link } = Typography

function Header() {
  const screens = Grid.useBreakpoint()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [searchValue, setSearchValue] = useState('')

  // Khi searchValue thay đổi, lưu vào localStorage nếu khác rỗng, nếu rỗng thì xóa
  useEffect(() => {
    if (searchValue) {
      localStorage.setItem('searchValue', searchValue)
    } else {
      localStorage.removeItem('searchValue')
    }
  }, [searchValue])

  // Khi component mount, lấy lại searchValue từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchValue')
    if (saved) setSearchValue(saved)
  }, [])

  // const { searchProductsByName, getProductById, getRandomProducts } = useProductHelper()
  const { getProductsByName, getProductByIdFromStore } = useProductService()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const home = useSelector(state => state.homeSetting.homeSettings);

  // Hàm xử lý khi người dùng nhập vào ô tìm kiếm
 const handleSearch = async (value) => {
  setSearchValue(value)
  if (!value) {
    setOptions([])
    return
  }
  const results = await getProductsByName(value)
  const mappedOptions = results.map((item, index) => ({
    key: `${item.name}__${index}`, // Now guaranteed unique
    value: item.name,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 4 }}>
        <>
          <div>
            {item.images[0] ? (
              <img
                src={item.images[0]}
                alt={item.name}
                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
              />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                <ThunderboltOutlined style={{ color: '#F37021', fontSize: 24 }} />
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: '#333', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.name}
              {item.colors && item.colors.length > 0 && (
                <span style={{ fontSize: 12, color: '#888', }}>
                  {item.colors.join(', ')}
                </span>
              )}
              {item.status && (
                <span
                  style={{
                    fontSize: 12,
                    color: item.status === 'Còn hàng' ? '#52c41a' : '#ff4d4f',
                    background: item.status === 'Còn hàng' ? '#f6ffed' : '#fff1f0',
                    borderRadius: 4,
                    padding: '2px 6px',
                    marginLeft: 4,
                    fontWeight: 400,
                  }}
                >
                  {item.statusSell}
                </span>
              )}
            </div>
            <div>
              <span style={{ color: '#F37021', fontWeight: 600 }}>
                {item.salePrice
                  ? (item.pricesBanLe - item.salePrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                  : item.pricesBanLe.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
              {item.salePrice && (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#aaa', marginLeft: 8, fontSize: 13 }}>
                    {item.pricesBanLe.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                  <span style={{ color: '#ff4d4f', marginLeft: 8, fontSize: 13 }}>
                    -{item.salePrice}%
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      </div>
    ),
    id: item.id,
    item,
    name: item.name,
  }))
  setOptions(mappedOptions)
}

  const handleSelect = (value, option) => {
  setOptions([]) // Reset lại options sau khi chọn
  setSearchValue('') // Xóa text sau khi search
  const product = option.item
  dispatch(setProduct(product))
  navigate(routePath.productDetail)
}

  const storeMenu = (
    <Menu>
      <Menu.Item key="danang">
        <a
          href="https://www.google.com/maps/place/C%E1%BB%ADa+h%C3%A0ng+Loa,+Tai+nghe,+Ph%E1%BB%A5+ki%E1%BB%87n+c%C3%B4ng+ngh%E1%BB%87+ch%C3%ADnh+h%C3%A3ng+t%E1%BA%A1i+%C4%90%C3%A0+N%E1%BA%B5ng+-+AMZ+TECH/@16.0659671,108.2281222,1044m/data=!3m1!1e3!4m6!3m5!1s0x3142192ac74d5237:0x84d4e7e69dfa4254!8m2!3d16.0659379!4d108.2307203!16s%2Fg%2F11s66cyymc?entry=tts&g_ep=EgoyMDI1MDYxMC4xIPu8ASoASAFQAw%3D%3D&skid=7260499d-3c77-4e0e-9874-2b3580162dd1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Đà Nẵng
        </a>
      </Menu.Item>
      <Menu.Item key="hanoi">
        <a
          href="https://www.google.com/maps/place/AMZ+TECH+H%C3%A0+N%E1%BB%99i+-+C%E1%BB%ADa+h%C3%A0ng+Loa,+Tai+nghe,+ph%E1%BB%A5+ki%E1%BB%87n+%C4%91i%E1%BB%87n+t%E1%BB%AD+ch%C3%ADnh+h%C3%A3ng/@21.0116923,105.8087566,1015m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3135ab0177a9de8d:0xe820380dfd55f75e!8m2!3d21.0116873!4d105.8113315!16s%2Fg%2F11y7d2ybyn?entry=tts&g_ep=EgoyMDI1MDYxMC4xIPu8ASoASAFQAw%3D%3D&skid=2e1bc059-883e-4ffc-a81c-c3534459e4f5"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hà Nội
        </a>
      </Menu.Item>
    </Menu>
  )

  // Thêm các item từ Sidebar
  const mainItems = [
    {
      icon: <img src={images['item11.png']} alt="" width={30} height={30} />,
      label: "Tai nghe nhét tai cũ",
      value: "tai nghe",
    },
    {
      icon: <img src={images['item10.png']} alt="" width={30} height={30} />,
      label: "Tai nghe chụp tai cũ",
      value: "Tai nghe cắm dây",
    },
    {
      icon: <img src={images['item9.png']} alt="" width={30} height={30} />,
      label: "Loa di động cũ",
      value: "Loa di động",
    },
    {
      icon: <img src={images['item8.png']} alt="" width={30} height={30} />,
      label: "Loa để bàn cũ",
      value: "Loa để bàn",
    },
    {
      icon: <img src={images['item7.png']} alt="" width={30} height={30} />,
      label: "Loa karaoke cũ",
      value: "Loa",
    },
    {
      icon: <img src={images['item6.png']} alt="" width={30} height={30} />,
      label: "Thu cũ đổi mới",
      value: "thu-cu-doi-moi",
    },
  ]

  const exploreItems = [
    {
      icon: <img src={images['item5.png']} alt="" width={30} height={30} />,
      label: "Hàng newseal",
    },
    {
      icon: <img src={images['item4.png']} alt="" width={30} height={30} />,
      label: "Khuyến mãi hot",
    },
    {
      icon: <img src={images['item3.png']} alt="" width={30} height={30} />,
      label: "Bảo hành - sửa chữa",
    },
  ]

  // Dummy data for brands, priceRanges, and needs (replace with real data as needed)
  const brands = [
    'Acnos',
    'Alpha Works',
    'Anker',
    'Bang & Olufsen',
    'Baseus',
    'Beats',
    'Bose',
    'Harman Kardon',
    'JBL',
    'Klipsch',
    'Marshall',
    'Others',
    'Sennheiser',
    'Skullcandy',
    'Sony',
    'Ultimate Ears'
  ]
  const priceRanges = [
    { value: [0, 1000000], label: 'Dưới 1 triệu đồng' },
    { value: [1000000, 2000000], label: 'Từ 1 triệu - 2 triệu' },
    { value: [2000000, 3000000], label: 'Từ 2 triệu - 3 triệu' },
    { value: [3000000, 5000000], label: 'Từ 3 triệu - 5 triệu' },
    { value: [5000000, Infinity], label: 'Trên 5 triệu' },
  ]
  const needs = [
    { value: 'chongon', label: 'Chống ồn' },
    { value: 'xuyendam', label: 'Xuyên âm' },
    { value: 'mic', label: 'Có micro đàm thoại' },
    { value: 'nghegoitot', label: 'Nghe gọi tốt' },
    { value: 'tapthethao', label: 'Tập luyện thể thao' },
    { value: 'chongnuoc', label: 'Chống nước, chống bụi' },
    { value: 'choigame', label: 'Chơi game' },
    { value: 'nghenhac', label: 'Nghe nhạc trữ tình' },
    { value: 'nghenhacso', label: 'Nghe nhạc sôi động' },
  ]

  const drawerContent = (
    <div>
      {location.pathname === '/product' ? (
        <SideBarProduct brands={brands} priceRanges={priceRanges} needs={needs} forceShow={true} />
      ) : (
        <Space size="large" direction="vertical" className="w-full">
          <Space>
            <Dropdown overlay={storeMenu} trigger={['click']}>
              <span className="text-[#F37021] cursor-pointer">
                <EnvironmentOutlined style={{ color: '#F37021', fontSize: '1.125rem' }} /> Tìm cửa hàng
              </span>
            </Dropdown>
          </Space>
          <Space>
            <PhoneOutlined style={{ color: '#F37021', fontSize: '1.125rem' }} />
            <a
              href="https://zalo.me/0333571236"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-[#F37021] inline-block"
              style={{ textDecoration: 'none' }}
            >
              Zalo: 0333.571.236
            </a>
          </Space>
          <div className="mt-2">
            <h3 className='mb-2 font-bold'>Từ khoá xu hướng&nbsp;</h3>
            <span className="text-gray-500 text-xs flex flex-col gap-1">
              {home[0]?.keywords && home[0].keywords.map((keyword, idx) => (
                <a
                  key={`${keyword}-${idx}`}
                  className="hover:underline !text-black cursor-pointer mx-1 !text-[12px]"
                  onClick={() => {
                    setSearchValue(keyword)
                    handleSearch(keyword)
                  }}
                >
                  {keyword}
                </a>
              ))}
            </span>
          </div>
          <div className="rounded-lg mb-4">
            <div className="font-semibold text-[16px] text-gray-700 mb-2 tracking-wide">
              Hàng cũ giá tốt - Sản phẩm chính
            </div>
            <div className="flex flex-col gap-3">
              {mainItems.map((item, idx) => (
                <div
                  key={idx}
                  className="w-full flex items-center gap-3 text-[15px] text-gray-800 rounded py-1 cursor-pointer transition-all duration-200 group hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:scale-[1.03] hover:shadow-md"
                  onClick={() => {
                    setOpen(false)
                    if (item.value === "thu-cu-doi-moi") {
                      navigate(routePath.exchange)
                    } else {
                      dispatch(setCategory(item.value))
                      navigate(routePath.product)
                    }
                  }}
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="transition-colors duration-200 group-hover:text-blue-700 font-semibold text-[16px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg">
            <div className="font-semibold text-[16px] text-gray-700 mb-2 tracking-wide">
              Khám phá thêm
            </div>
            <div className="flex flex-col gap-3">
              {exploreItems.map((item, idx) => (
                <div
                  key={idx}
                  className="w-full flex items-center gap-3 text-[15px] text-gray-800 rounded py-1 cursor-pointer transition-all duration-200 group hover:bg-gradient-to-r hover:from-pink-100 hover:to-yellow-100 hover:scale-[1.03] hover:shadow-md"
                  onClick={() => {
                    setOpen(false)
                    if (item.label === "Khuyến mãi hot") {
                      navigate(routePath.sale)
                    }
                  }}
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="transition-colors duration-200 group-hover:text-pink-700 font-semibold text-[16px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Space>
      )}
    </div>
  )

  return (
    <div className="p-0 z-[100] relative">
      <div className="bg-orange-50 py-1 hidden lg:block">
        <Row justify="space-between" align="middle" className="max-w-[1400px] mx-auto px-8">
          <Col>
            <span className="text-[#F37021] font-medium text-base flex items-center gap-1">
              <ClockCircleOutlined className="text-[#F37021]" style={{ fontSize: '16px' }} />
              THU CŨ ĐỔI MỚI - LÊN ĐỜI SIÊU PHẨM
            </span>
          </Col>
          <Col>
            <span className="text-[#F37021] font-medium text-base flex items-center gap-1">
              <DollarCircleOutlined className="text-[#F37021]" style={{ fontSize: '16px' }} />
              HÀNG CŨ GIÁ RẺ - BẢO HÀNH SIÊU LÂU
            </span>
          </Col>
          <Col>
            <span className="text-[#F37021] font-medium text-base flex items-center gap-1">
              <TruckOutlined className="text-[#F37021]" style={{ fontSize: '16px' }} />
              BÁN HÀNG CÓ TÂM - VẬN CHUYỂN CÓ TẦM
            </span>
          </Col>
        </Row>
      </div>
      <Row justify="space-between" align="middle" className="max-w-[1400px] mx-auto py-4 px-4 md:px-8">
        <Col xs={0} sm={4} md={3} lg={2}>
          <img
            src={AMZLogo}
            alt="Logo"
            onClick={() => navigate(routePath.home)}
            className="hidden sm:block w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full object-cover"
          />
        </Col>
        <Col xs={24} sm={20} md={21} lg={14} flex="auto" className="px-0 md:px-8">
          <div className="flex items-center gap-2">
            {!screens.sm && (
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: 24, color: '#F37021' }} />}
                onClick={() => setOpen(true)}
                className="flex items-center"
              />
            )}
            <div className="flex-1">
              <AutoComplete
                value={searchValue}
                options={options}
                style={{ width: '100%' }}
                onSearch={handleSearch}
                onChange={setSearchValue}
                onSelect={handleSelect}
                className="rounded-full bg-gray-50"
                classNames={{ popup: { root: "w-full" } }} // <-- update here
                open={options.length > 0 && searchValue.length > 0}
              >
                <Input
                  size="large"
                  placeholder="Hôm nay bạn muốn tìm kiếm gì?"
                  suffix={
                    <Button
                      type="text"
                      icon={<SearchOutlined className="text-[#F37021]" />}
                      style={{ background: '#fff', color: '#F37021' }}
                    >
                      <span className="hidden md:inline">Tìm kiếm</span>
                    </Button>
                  }
                  style={{ border: '1px solid #F37021' }}
                />
              </AutoComplete>
            </div>
          </div>
          <div className="mt-6 flex items-baseline">
            <h3 className='mb-2 text-[16px] text-[#D65312] font-medium'>Từ khoá xu hướng&nbsp;</h3>
            <span className="text-gray-500 text-xs flex gap-1">
              {home[0]?.keywords && home[0].keywords.map((keyword, idx) => (
                <a
                  key={`${keyword}-${idx}`}
                  className="hover:underline !text-black cursor-pointer mx-1 !text-[12px]"
                  onClick={() => {
                    setSearchValue(keyword)
                    handleSearch(keyword)
                  }}
                >
                  {keyword}
                </a>
              ))}
            </span>
          </div>
        </Col>
        {/* Contact: chỉ hiện trên md trở lên */}
        <Col xs={0} sm={0} md={0} lg={6} className="hidden lg:block">
          <div className='!mt-[-25px]  hidden lg:block'>
            <Space>
              <Dropdown overlay={storeMenu} trigger={['click']}>
                <span className="text-[#F37021] inline-block cursor-pointer">
                  <EnvironmentOutlined style={{ color: '#F37021', fontSize: '1.125rem' }} /> Tìm cửa hàng
                </span>
              </Dropdown>
            </Space>
            <Space className='ml-4'>
              <PhoneOutlined style={{ color: '#F37021', fontSize: '1.125rem' }} />
              <a
                href="https://zalo.me/0333571236"
                target="_blank"
                rel="noopener noreferrer"
                className="!text-[#F37021] inline-block"
                style={{ textDecoration: 'none' }}
              >
                Zalo: 0333.571.236
              </a>
            </Space>
          </div>
        </Col>
      </Row>
      {/* Drawer cho mobile */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        className="md:hidden"
        width={280}
      >
        {drawerContent}
      </Drawer>
    </div>
  )
}

export default Header