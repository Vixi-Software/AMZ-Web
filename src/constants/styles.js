// Styles constants để tránh tạo object mới trong mỗi render
export const LAYOUT_STYLES = {
  layout: {
    minHeight: '100vh'
  },
  sider: {
    background: '#fff',
    borderRight: '1px solid #f0f0f0',
  },
  logoContainer: {
    height: 48,
    margin: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    cursor: 'pointer',
    objectFit: 'cover'
  },
  header: {
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 64
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  userEmail: {
    marginRight: 12
  },
  logoutButton: {
    marginLeft: 16
  },
  content: {
    margin: '16px'
  },
  contentInner: {
    padding: 24,
    minHeight: 360,
  },
  menuItemIcon: {
    marginLeft: 8
  }
};

export const SIDEBAR_WIDTH = 260;
