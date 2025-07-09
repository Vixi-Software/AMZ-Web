import React from 'react'
import { Spin } from 'antd'

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-150 bg-white/60">
      <Spin size="large" tip="Đang tải..." />
    </div>
  )
}

export default Loading