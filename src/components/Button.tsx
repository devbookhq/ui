import React from 'react'

interface Props {
  text?: string
  icon?: JSX.Element
  className?: string
  onClick?: (e: any) => void
  isDisabled?: boolean
}

function Button({
  text,
  icon,
  className = '',
  onClick,
  isDisabled
}: Props) {
  return (
    <button
      className={`
        ${className}
        rounded-lg
        bg-black-700
        hover:bg-green-gradient
        hover:shadow-lg
        ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}
      `}
      onMouseDown={!isDisabled ? onClick : undefined}
    >
      <div className="
        py-0.5
        px-1
        flex
        flex-row
        items-center
        justify-center
        space-x-1
        text-gray-500
        rounded
        hover:bg-white-900/10
        transition-colors
      ">
        {icon}
        {text && (
          <div className="
            text-xs
            text-gray-200
            leading-[15px]
            font-sans
          ">
            {text}
          </div>
        )}
      </div>
    </button>
  )
}

export default Button