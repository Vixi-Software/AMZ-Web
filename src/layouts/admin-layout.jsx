import React, { useState, useEffect } from 'react';
import {
  AppstoreOutlined,
  PlusSquareOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  EditOutlined,
  CalendarOutlined,
  SettingOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Typography, Button, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/features/auth/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AMZLogo from '../assets/amzLogo.jpg';
import routePath from '../constants/routePath';

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

const items = [
  getItem('Quản lý sản phẩm', 'sub-product', <AppstoreOutlined />, [
    getItem(<Link to={routePath.admin}><UnorderedListOutlined /> Danh sách sản phẩm</Link>, routePath.admin),
    getItem(<Link to={routePath.adminProductAdd}><PlusSquareOutlined /> Thêm sản phẩm</Link>, routePath.adminProductAdd),
    // Có thể thêm các route con khác nếu cần
  ]),
  getItem('Quản lý bài viết', 'sub-post', <FileTextOutlined />, [
    getItem(<Link to={routePath.adminPost}><UnorderedListOutlined /> Danh sách bài viết</Link>, routePath.adminPost),
    getItem(<Link to={routePath.adminPostAdd}><EditOutlined /> Thêm bài viết</Link>, routePath.adminPostAdd),
    // Có thể thêm các route con khác nếu cần
  ]),
  getItem(<Link to={routePath.adminEvent}><CalendarOutlined /> Quản lý sự kiện</Link>, routePath.adminEvent, ),
  getItem('Quản lý trang', 'sub-config', <SettingOutlined />, [
    getItem(<Link to={routePath.adminConfig}><HomeOutlined /> Trang chủ</Link>, routePath.adminConfig),
    // Thêm các route con khác nếu cần
  ]),
];

function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        width={260} // Tăng chiều rộng sidebar tại đây
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          overflow: 'auto',
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
            style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
          />
        </div>
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          defaultOpenKeys={['sub-product', 'sub-post', 'sub-config']} // Thêm dòng này để mở mặc định các submenu
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
          zIndex: 999,
          borderBottom: '1px solid #f0f0f0',
          transition: 'left 0.2s'
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
              minHeight: 'calc(100vh - 128px)',
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