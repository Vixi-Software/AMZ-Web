import React from 'react'

function Loading() {
  return (
    <div>
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
        <div className="text-center mt-4">
            <p className="text-gray-600">Đang tải...</p>
        </div>
    </div>
  )
}

export default Loading