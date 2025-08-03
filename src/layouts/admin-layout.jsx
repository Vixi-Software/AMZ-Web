import React, { useState, useEffect } from 'react';
import {
  FileTextOutlined,
  UnorderedListOutlined,
  SecurityScanOutlined,
  CalendarOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Typography, Button, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/features/auth/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AMZLogo from '../assets/amzLogo.jpg';
import routePath from '../constants/routePath';
import { setCategory } from '@/store/features/filterProduct/filterProductSlice'


const { Header, Content, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Tạo items động dựa trên trạng thái collapsed


function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const createMenuItems = (collapsed) => [
    getItem(
      collapsed ?
        <Link to={routePath.adminConfig}>
          <HomeOutlined />
        </Link>
        :
        <Link to={routePath.adminConfig}>
          <HomeOutlined /> Trang chủ
        </Link>,
      routePath.adminConfig
    ),
    getItem(
      collapsed ?
        <Link to={routePath.adminEvent}>
          <CalendarOutlined />
        </Link>
        :
        <Link to={routePath.adminEvent}>
          <CalendarOutlined /> Quản lý sự kiện
        </Link>,
      routePath.adminEvent
    ),
    getItem(
      <Link to={routePath.admin}>
        <UnorderedListOutlined /> Danh sách sản phẩm
      </Link>,
      routePath.admin
    ),
    getItem(
      <Link to={routePath.adminPost}>
        <FileTextOutlined /> Danh sách bài viết
      </Link>,
      routePath.adminPost
    ),
    getItem(
      collapsed ?
        <Link to={routePath.adminPolicyPurchase}
          onClick={() => setCategory("Chính sách mua hàng")}
        >
          <SecurityScanOutlined />
        </Link>
        :
        <Link to={routePath.adminPolicyPurchase}
          onClick={() => dispatch(setCategory("Chính sách mua hàng"))}
        >
          <ShoppingCartOutlined /> Quản lý Chính sách mua hàng
        </Link>,
      routePath.adminPolicyPurchase
    ),
    getItem(
      collapsed ?
        <Link to={routePath.adminPolicyWarranty}
          onClick={() => dispatch(setCategory("Chính sách bảo hành"))}
        >
          <SecurityScanOutlined />
        </Link>
        :
        <Link to={routePath.adminPolicyWarranty}
          onClick={() => dispatch(setCategory("Chính sách bảo hành"))}
        >
          <ToolOutlined /> Chính sách bảo hành
        </Link>,
      routePath.adminPolicyWarranty
    ),
    getItem(
      collapsed ?
        <Link to={routePath.adminPolicyPrivacy}
          onClick={() => dispatch(setCategory("Chính sách bảo mật"))}
        >
          <SecurityScanOutlined />
        </Link>
        :
        <Link to={routePath.adminPolicyPrivacy}
          onClick={() => dispatch(setCategory("Chính sách bảo mật"))}
        >
          <SafetyCertificateOutlined /> Chính sách bảo mật
        </Link>,
      routePath.adminPolicyPrivacy
    ),
     getItem(
      collapsed ?
        <Link to={routePath.adminPolicyPrivacy}
          onClick={() => dispatch(setCategory("Thu cũ đổi mới"))}
        >
          <SwapOutlined />
        </Link>
        :
        <Link to={routePath.adminPolicyExchange}
          onClick={() => dispatch(setCategory("Thu cũ đổi mới"))}
        >
          <SwapOutlined /> Thu cũ đổi mới
        </Link>,
      routePath.adminPolicyExchange
    ),
  ];


  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (!user) {
      navigate(routePath.login, { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null; // Trả về null nếu không có user

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260} // Chiều rộng khi mở rộng
        collapsedWidth={80} // Chiều rộng khi thu gọn
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: 48,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={AMZLogo}
            alt="Logo"
            onClick={() => navigate(routePath.admin)}
            style={{
              width: collapsed ? 32 : 40,
              height: collapsed ? 32 : 40,
              borderRadius: '50%',
              cursor: 'pointer',
              objectFit: 'cover',
              transition: 'all 0.2s'
            }}
          />
        </div>
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={createMenuItems(collapsed)}
          defaultOpenKeys={collapsed ? [] : ['sub-product', 'sub-post']} // Không mở submenu khi collapsed
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          minHeight: 64,
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? 80 : 260,
          zIndex: 99,
          transition: 'left 0.2s',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ marginRight: 12 }}>{user.email}</Text>
              <Avatar src="https://i.pravatar.cc/40" />
              <Button type="link" onClick={handleLogout} style={{ marginLeft: 16 }}>
                Đăng xuất
              </Button>
            </div>
          )}
        </Header>
        <Content style={{
          marginTop: 64,
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          padding: '16px'
        }}>
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 96px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;