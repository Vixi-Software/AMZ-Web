import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook để quản lý trạng thái sidebar
 * Tối ưu hiệu năng bằng cách sử dụng useCallback và useMemo
 */
export const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = useCallback((value) => {
    setCollapsed(value);
  }, []);

  const defaultOpenKeys = useMemo(() => 
    collapsed ? [] : ['sub-product', 'sub-post'], 
    [collapsed]
  );

  return {
    collapsed,
    handleCollapse,
    defaultOpenKeys,
  };
};
