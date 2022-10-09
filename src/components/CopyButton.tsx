import React, { useState } from 'react'

import Button from './Button'
import CheckIcon from './icons/Check'
import CopyIcon from './icons/Copy'

export interface Props {
  onClick?: () => void
}

function CopyButton({ onClick }: Props) {
  const [icon, setIcon] = useState(<CopyIcon className="text-white-900/40" />)

  function handleClick() {
    setIcon(<CheckIcon className="text-green-500" />)
    onClick?.()

    // Wait 1s and then switch back to the copy icon.
    setTimeout(() => {
      setIcon(<CopyIcon className="text-white-900/40" />)
    }, 1000)
  }

  return (
    <Button
      className="dbk-button"
      icon={icon}
      onClick={handleClick}
    />
  )
}

export default CopyButton
