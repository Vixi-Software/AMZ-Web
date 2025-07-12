import React from 'react';
import PropTypes from 'prop-types';
import { LAYOUT_STYLES } from '../../constants/styles';
import AMZLogo from '../../assets/amzLogo.jpg';

// Component Logo tối ưu
const Logo = React.memo(({ onClick }) => (
  <div style={LAYOUT_STYLES.logoContainer}>
    <img
      src={AMZLogo}
      alt="Logo"
      onClick={onClick}
      style={LAYOUT_STYLES.logo}
    />
  </div>
));

Logo.propTypes = {
  onClick: PropTypes.func.isRequired,
};

Logo.displayName = 'Logo';

export default Logo;
