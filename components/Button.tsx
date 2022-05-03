import React from 'react'
import Text from 'components/typography/Text'

interface Props {
  text: string
  onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

function Button({
  text,
  onClick,
}: Props) {
  return (
    <button
      className="
        py-1.5
        px-3

        flex
        items-center
        justify-center

        rounded-lg

        bg-green-500
      "
      onClick={onClick}
    >
      <Text text={text}/>
    </button>
  )
}

export default Button
