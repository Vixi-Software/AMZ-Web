import React, { useEffect } from 'react';
import {
  AppstoreOutlined,
  PlusSquareOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  EditOutlined,
  CalendarOutlined,
  SettingOutlined,
  HomeOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/features/auth/authSlice';
import { selectUser, selectUserEmail } from '../store/selectors/authSelectors';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';
import { LAYOUT_STYLES, SIDEBAR_WIDTH } from '../constants/styles';
import UserInfo from '../components/features/UserInfo';
import Logo from '../components/features/Logo';
import routePath from '../constants/routePath';

const { Header, Content, Sider } = Layout;

// Tách component MenuItem để tối ưu re-render
const MenuItem = React.memo(({ to, icon, text, collapsed }) => (
  <Link to={to}>
    {icon}
    {!collapsed && <span style={LAYOUT_STYLES.menuItemIcon}>{text}</span>}
  </Link>
));

MenuItem.displayName = 'MenuItem';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Function to generate menu items
const getMenuItems = (collapsed) => [
  getItem(
    <MenuItem to={routePath.adminConfig} icon={<HomeOutlined />} text="Trang chủ" collapsed={collapsed} />, 
    routePath.adminConfig
  ),
  getItem(
    <MenuItem to={routePath.adminEvent} icon={<CalendarOutlined />} text="Quản lý sự kiện" collapsed={collapsed} />, 
    routePath.adminEvent
  ),
  getItem(
    <MenuItem to={routePath.adminWarranty} icon={<ToolOutlined />} text="Quản lý bảo hành sửa chữa" collapsed={collapsed} />, 
    routePath.adminWarranty
  ),
  getItem(
    collapsed ? <AppstoreOutlined /> : 'Quản lý sản phẩm', 
    'sub-product', 
    <AppstoreOutlined />, 
    [
      getItem(
        <MenuItem to={routePath.admin} icon={<UnorderedListOutlined />} text="Danh sách sản phẩm" collapsed={collapsed} />, 
        routePath.admin
      ),
      getItem(
        <MenuItem to={routePath.adminProductAdd} icon={<PlusSquareOutlined />} text="Thêm sản phẩm" collapsed={collapsed} />, 
        routePath.adminProductAdd
      ),
    ]
  ),
  getItem(
    collapsed ? <FileTextOutlined /> : 'Quản lý bài viết', 
    'sub-post', 
    <FileTextOutlined />, 
    [
      getItem(
        <MenuItem to={routePath.adminPost} icon={<UnorderedListOutlined />} text="Danh sách bài viết" collapsed={collapsed} />, 
        routePath.adminPost
      ),
      getItem(
        <MenuItem to={routePath.adminPostAdd} icon={<EditOutlined />} text="Thêm bài viết" collapsed={collapsed} />, 
        routePath.adminPostAdd
      ),
    ]
  ),
  // getItem('Quản lý trang', 'sub-config', <SettingOutlined />, [
  //   // Thêm các route con khác nếu cần
  // ]),
];

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userEmail = useSelector(selectUserEmail);
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, handleCollapse, defaultOpenKeys } = useSidebar();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Memoize callback để tránh re-render không cần thiết
  const handleLogout = React.useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleLogoClick = React.useCallback(() => {
    navigate(routePath.admin);
  }, [navigate]);

  // Memoize menu items để tránh tính toán lại
  const menuItems = React.useMemo(() => getMenuItems(collapsed), [collapsed]);

  useEffect(() => {
    if (!user) {
      navigate(routePath.login, { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null; // Trả về null nếu không có user

  return (
    <Layout style={LAYOUT_STYLES.layout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        width={SIDEBAR_WIDTH}
        style={LAYOUT_STYLES.sider}
      >
        <Logo onClick={handleLogoClick} />
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          defaultOpenKeys={defaultOpenKeys}
        />
      </Sider>
      <Layout>
        <Header style={{ ...LAYOUT_STYLES.header, background: colorBgContainer }}>
          {user && <UserInfo userEmail={userEmail} onLogout={handleLogout} />}
        </Header>
        <Content style={LAYOUT_STYLES.content}>
          <div
            style={{
              ...LAYOUT_STYLES.contentInner,
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

// Sử dụng React.memo để tối ưu component
export default React.memo(AdminLayout);