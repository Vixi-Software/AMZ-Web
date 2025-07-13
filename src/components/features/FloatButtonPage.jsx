import React, { useEffect, useState } from 'react'
import { FloatButton } from 'antd'
import '../../assets/css/FloatButton.css'
import ZaloIcon from '../../assets/ic-zalo.svg'
import FacebookIcon from '../../assets/ic-facebook.svg'
import PhoneIcon from '../../assets/ic-phone.svg'

const BUTTON_STYLE = {
  width: 70,
  height: 70,
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

  const [hoveredButton, setHoveredButton] = useState({
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
            <span style={{ fontWeight: 'bold', color: '#0068FF', fontSize: 14 }}>
              {hoveredButton.zalo ? 'Liên hệ ngay' : <img src={ZaloIcon} alt="Zalo" style={{ width: 40, height: 40 }} />}
            </span>
          }
          style={ZALO_BUTTON_STYLE}
          tooltip={{
            title: (
              <div>
                <div>Liên hệ ngay 0333.571.236</div>
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
          onMouseEnter={() => {
            setHoveredButton(prev => ({ ...prev, zalo: true }))
          }}
          onMouseLeave={() => {
            setHoveredButton(prev => ({ ...prev, zalo: false }))
          }}
        />
        <FloatButton
          description={
            <span style={{ fontWeight: 'bold', color: '#1877f2', fontSize: 14 }}>
              {hoveredButton.facebook ? 'Liên hệ ngay' : <img src={FacebookIcon} alt="Facebook" style={{ width: 40, height: 40 }} />}
            </span>
          }
          style={FACEBOOK_BUTTON_STYLE}
          tooltip={{
            title: (
              <div>
                <div>Liên hệ ngay AMZ TECH</div>
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
          onMouseEnter={() => {
            setHoveredButton(prev => ({ ...prev, facebook: true }))
          }}
          onMouseLeave={() => {
            setHoveredButton(prev => ({ ...prev, facebook: false }))
          }}
        />
        <FloatButton
          description={
            <span style={{ fontWeight: 'bold', color: '#25D366', fontSize: 14 }}>
              {hoveredButton.phone ? 'Gọi ngay' : <img src={PhoneIcon} alt="Phone" style={{ width: 40, height: 40 }} />}
            </span>
          }
          style={PHONE_BUTTON_STYLE}
          tooltip={{
            title: (
              <div>
                <div>Gọi ngay 0333.571.236</div>
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
          onMouseEnter={() => {
            setHoveredButton(prev => ({ ...prev, phone: true }))
          }}
          onMouseLeave={() => {
            setHoveredButton(prev => ({ ...prev, phone: false }))
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