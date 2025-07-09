import React from 'react'
import { Grid } from 'antd'

function Breadcum({ content }) {
  const screens = Grid.useBreakpoint()
  const isSmall = screens.sm === false // sm: 576px

  if (!Array.isArray(content) || content.length === 0) return null

  return (
    <div className="mb-4 mt-4">
      <nav className={`flex items-center ${isSmall ? 'gap-0' : 'gap-2'} ${isSmall ? 'text-xs' : 'text-sm'}`}>
        {content.map((item, idx) => (
          <React.Fragment key={idx}>
            <span
              className={
                "flex items-center gap-1 cursor-pointer " +
                (isSmall ? "px-2 py-1" : "p-2") + " " +
                (item.active
                  ? "bg-orange-500 text-white font-semibold rounded-full border-2 border-orange-500"
                  : "text-black border-2 rounded-full border-black")
              }
              onClick={item.onClick}
              style={item.active ? {} : { userSelect: "none" }}
            >
              {item.icon && item.icon}
              {item.label}
            </span>
            {idx < content.length - 1 && (
              <span className={`mx-1 text-black  ${isSmall ? 'text-xs' : ''}`}>{'>'}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  )
}

export default Breadcum