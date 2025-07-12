import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Typography, Button } from 'antd';
import { LAYOUT_STYLES } from '../../constants/styles';

const { Text } = Typography;

// Component tối ưu cho thông tin người dùng
const UserInfo = React.memo(({ userEmail, onLogout }) => (
  <div style={LAYOUT_STYLES.userInfo}>
    <Text style={LAYOUT_STYLES.userEmail}>{userEmail}</Text>
    <Avatar src="https://i.pravatar.cc/40" />
    <Button type="link" onClick={onLogout} style={LAYOUT_STYLES.logoutButton}>
      Đăng xuất
    </Button>
  </div>
));

UserInfo.propTypes = {
  userEmail: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

UserInfo.displayName = 'UserInfo';

export default UserInfo;
