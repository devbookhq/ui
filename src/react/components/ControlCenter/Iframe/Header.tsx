import {
  MouseEvent,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react'

import RefreshIcon from '../../RefreshIcon'
import IconButton from '../../IconButton'

export interface Props {
  url?: string
  onReloadIframe: (e: MouseEvent) => void
  onConfirm: (url: string) => void
}

function Header({
  url = '',
  onReloadIframe,
  onConfirm,
}: Props) {
  const [newURL, setNewURL] = useState<string>()

  useEffect(function initializeURL() {
    setNewURL(url)
  }, [url])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (newURL) {
        onConfirm(newURL)
      }
    }
  }

  function handleInputChange(e: any) {
    setNewURL(e.target.value)
  }

  function onRefresh(e: MouseEvent) {
    if (newURL) {
      onConfirm(newURL)
    }
    onReloadIframe(e)
  }

  return (
    <div className="flex items-center space-x-2 py-2 px-1 min-w-0">
      <IconButton
        onMouseDown={onRefresh}
        icon={<RefreshIcon />}
      />
      <input
        className="
          p-0.5
          pl-[10px]
          min-w-0
          flex
          flex-1
          placeholder:text-denim-400
          dark:placeholder:text-gray-700
          border
          border-gray-500
          dark:border-black-600
          text-2xs
          font-400
          rounded
          font-mono
          text-denim-700
          dark:text-gray-200
          bg-black-650
          outline-none
        "
        value={newURL}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        placeholder="https://"
      />
    </div>
  )
}

export default Header
