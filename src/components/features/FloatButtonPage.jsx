import React, { useEffect, useState } from 'react'
import { FloatButton } from 'antd'
import { FacebookFilled, PhoneOutlined } from '@ant-design/icons'

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

  useEffect(() => {
    // Thêm CSS animation vào document
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      
      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .ant-float-btn:hover .ant-float-btn-body .ant-float-btn-description span {
        color: white !important;
      }
      
      .ant-float-btn:hover .ant-float-btn-body .ant-float-btn-description .anticon {
        color: white !important;
      }
      
      /* Custom tooltip styles */
      .ant-tooltip .ant-tooltip-inner {
        background: linear-gradient(135deg, #ff6b35, #ff8c42, #ff9500, #ffb347) !important;
        background-size: 300% 300% !important;
        animation: gradientShift 3s ease infinite !important;
        border-radius: 12px !important;
        padding: 16px 20px !important;
        box-shadow: 0 8px 32px rgba(255, 107, 53, 0.4), 
                    0 0 20px rgba(255, 149, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        font-family: 'Segoe UI', sans-serif !important;
        position: relative !important;
      }
      
      .ant-tooltip .ant-tooltip-inner::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
        border-radius: 12px !important;
        pointer-events: none !important;
      }
      
      .ant-tooltip .ant-tooltip-inner > div {
        position: relative !important;
        z-index: 1 !important;
        color: white !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
      }
      
      .ant-tooltip .ant-tooltip-inner > div > div:first-child {
        font-size: 16px !important;
        font-weight: 700 !important;
        color: #fff !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
        margin-bottom: 8px !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      
      .ant-tooltip .ant-tooltip-inner > div > div:not(:first-child) {
        font-size: 14px !important;
        color: rgba(255, 255, 255, 0.95) !important;
        margin-bottom: 4px !important;
        font-weight: 500 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
      }
      
      .ant-tooltip .ant-tooltip-inner > div > div:last-child {
        margin-bottom: 0 !important;
        font-weight: 600 !important;
        color: #fff !important;
      }
      
      .ant-tooltip .ant-tooltip-arrow::before {
        background: linear-gradient(135deg, #ff6b35, #ff8c42) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      
      .ant-tooltip .ant-tooltip-arrow::after {
        background: linear-gradient(135deg, #ff6b35, #ff8c42) !important;
      }
      
      /* Hover effects for tooltips */
      .ant-tooltip:hover .ant-tooltip-inner {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 40px rgba(255, 107, 53, 0.5), 
                    0 0 25px rgba(255, 149, 0, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        transition: all 0.3s ease !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

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