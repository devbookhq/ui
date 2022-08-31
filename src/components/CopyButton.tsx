import React, { useState } from 'react'

import CopyIcon from './icons/Copy'
import CheckIcon from './icons/Check'
import Button from './Button'

export interface Props {
  onClick?: (e: any) => void
}

function CopyButton({
  onClick,
}: Props) {
  const [icon, setIcon] = useState(<CopyIcon className="text-white-900/40" />)

  function handleClick(e: any) {
    setIcon(<CheckIcon className="text-green-500" />)
    onClick?.(e)

    // Wait 1s and then switch back to the copy icon.
    setTimeout(() => {
      setIcon(<CopyIcon className="text-white-900/40" />)
    }, 1000)
  }

  return (
    <Button
      className='dkb-copy-btn dbk-button'
      icon={icon}
      onClick={handleClick}
    />
  )
}

export default CopyButton