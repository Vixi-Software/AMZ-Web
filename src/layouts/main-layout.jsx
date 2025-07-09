import React from 'react'
import Header from '../components/features/Header'
import Sidebar from '../components/features/Sidebar'
import { Flex, Grid } from 'antd'
import Footer from '../components/features/Footer'

const { useBreakpoint } = Grid

function MainLayout({ children }) {
  const screens = useBreakpoint()

  // screens.sm, screens.md, screens.lg là boolean
  // Ví dụ: screens.sm === true nếu màn hình >= sm

  return (
    <div>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#F3F3F3'
        }}
      >
        <Header />
      </div>
      <div className="max-w-[1400px] mx-auto px-2 md:pe-0 md:pl-4 lg:px-0">
        <Flex gap={16} style={{ alignItems: 'flex-start' }}>
          <div
            className='hidden sm:block'
            style={{
              position: 'sticky',
              top: 164, // chiều cao Header, chỉnh lại nếu Header cao khác
              flex: `0 0 ${screens.lg ? 303 : screens.md ? 180 : 250}px`,
              maxWidth: screens.lg ? 303 : screens.md ? 180 : 250,
              width: '100%',
              height: 'calc(100vh - 72px)', // trừ chiều cao Header
              overflowY: 'auto'
            }}
          >
            <Sidebar />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {children}
            <Footer />
          </div>
        </Flex>
      </div>
    </div>
  )
}

export default MainLayout