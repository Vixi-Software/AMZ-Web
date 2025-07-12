import React, { useEffect, useState } from 'react'
import { FloatButton } from 'antd'
import { FacebookFilled, PhoneOutlined } from '@ant-design/icons'
import '../../assets/css/FloatButton.css'

const BUTTON_STYLE = {
  width: 100,
  height: 100,
  fontSize: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  animation: 'pulse 2s infinite'
}

const ZALO_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  backgroundColor: '#0068FF',
  borderColor: '#0068FF',
  boxShadow: '0 4px 15px rgba(0, 104, 255, 0.3)'
}

const FACEBOOK_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  backgroundColor: '#1877f2',
  borderColor: '#1877f2',
  boxShadow: '0 4px 15px rgba(24, 119, 242, 0.3)'
}

const PHONE_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  backgroundColor: '#25D366',
  borderColor: '#25D366',
  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
}

function FloatButtonPage() {
  const [visibleTooltips, setVisibleTooltips] = useState({
    zalo: false,
    facebook: false,
    phone: false
  })

  // Tự động hiển thị tooltip mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      const tooltips = ['zalo', 'facebook', 'phone']
      const randomTooltip = tooltips[Math.floor(Math.random() * tooltips.length)]
      
      setVisibleTooltips(prev => ({
        ...prev,
        [randomTooltip]: true
      }))
      
      // Ẩn tooltip sau 3 giây
      setTimeout(() => {
        setVisibleTooltips(prev => ({
          ...prev,
          [randomTooltip]: false
        }))
      }, 3000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <FloatButton.Group shape="circle" style={{ right: 24, bottom: 24 }}>
        <FloatButton
          description={
            <span style={{ fontWeight: 'bold', color: '#0068FF', fontSize: 16 }}>Zalo ngay</span>
          }
          style={ZALO_BUTTON_STYLE}
          tooltip={{
            title: (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>💬 Zalo Chat</div>
                <div>Tư vấn nhanh qua Zalo</div>
                <div>📞 0333.571.236</div>
                <div>⚡ Phản hồi trong 1 phút</div>
              </div>
            ),
            placement: 'left',
            open: visibleTooltips.zalo,
            color: 'transparent',
            overlayClassName: 'custom-tooltip',
            onOpenChange: (open) => {
              if (!open) {
                setVisibleTooltips(prev => ({ ...prev, zalo: false }))
              }
            }
          }}
          onClick={() => {
            window.open('https://zalo.me/0333571236', '_blank')
          }}
        />
        <FloatButton
          description={
            <span style={{ fontWeight: 'bold', color: '#1877f2', fontSize: 16 }}>Nhắn tin ngay</span>
          }
          style={FACEBOOK_BUTTON_STYLE}
          tooltip={{
            title: (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>📘 Facebook Chat</div>
                <div>Nhắn tin Facebook</div>
                <div>🔥 Hỗ trợ 24/7</div>
                <div>💬 @amztechdn</div>
              </div>
            ),
            placement: 'left',
            open: visibleTooltips.facebook,
            color: 'transparent',
            overlayClassName: 'custom-tooltip',
            onOpenChange: (open) => {
              if (!open) {
                setVisibleTooltips(prev => ({ ...prev, facebook: false }))
              }
            }
          }}
          onClick={() => {
            window.open('https://www.facebook.com/amztechdn', '_blank')
          }}
        />
        <FloatButton
          description={
            <span style={{ fontWeight: 'bold', color: '#25D366', fontSize: 16 }}>Gọi ngay</span>
          }
          style={PHONE_BUTTON_STYLE}
          tooltip={{
            title: (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>📞 Gọi ngay</div>
                <div>Tư vấn qua điện thoại</div>
                <div>☎️ 0333.571.236</div>
                <div>🆓 Miễn phí cuộc gọi</div>
              </div>
            ),
            placement: 'left',
            open: visibleTooltips.phone,
            color: 'transparent',
            overlayClassName: 'custom-tooltip',
            onOpenChange: (open) => {
              if (!open) {
                setVisibleTooltips(prev => ({ ...prev, phone: false }))
              }
            }
          }}
          // onClick={() => {
          //   window.open('tel:0333571236')
          // }}
        />
      </FloatButton.Group>
    </>
  )
}

export default FloatButtonPage