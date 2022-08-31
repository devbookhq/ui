import React from 'react'

interface Props {
  textRight?: string
  textLeft?: string
  icon?: JSX.Element
  className?: string
  onClick?: () => void
  isDisabled?: boolean
}

function Button({
  textLeft,
  textRight,
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
        dbk-button
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
        {textLeft && (
          <div className="
            text-xs
            text-gray-200
            leading-[15px]
            font-sans
          ">
            {textLeft}
          </div>
        )}
        {icon}
        {textRight && (
          <div className="
            text-xs
            text-gray-200
            leading-[15px]
            font-sans
          ">
            {textRight}
          </div>
        )}
      </div>
    </button>
  )
}

export default Button