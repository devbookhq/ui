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
  isDisabled,
}: Props) {
  return (
    <button
      className={`
        ${className}
        dbk-button
        hover:bg-green-gradient
        rounded-lg
        bg-black-700
        hover:shadow-lg
        ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}
      `}
      onMouseDown={!isDisabled ? onClick : undefined}
    >
      <div
        className="
        flex
        flex-row
        items-center
        justify-center
        space-x-1
        rounded-lg
        py-0.5
        px-1
        text-gray-500
        transition-colors
        hover:bg-white-900/10
      "
      >
        {textLeft && (
          <div
            className="
            font-sans
            text-xs
            leading-[15px]
            text-gray-200
          "
          >
            {textLeft}
          </div>
        )}
        {icon}
        {textRight && (
          <div
            className="
            font-sans
            text-xs
            leading-[15px]
            text-gray-200
          "
          >
            {textRight}
          </div>
        )}
      </div>
    </button>
  )
}

export default Button
