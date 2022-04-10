import {
  MouseEvent,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react'

import RefreshIcon from '../RefreshIcon'
import IconButton from '../IconButton'
import CellHeader from '../CellHeader'

export interface Props {
  url?: string
  onReloadIframe: (e: MouseEvent) => void
  onConfirm: (url: string) => void
  rounded?: boolean
}

function Header({
  url = '',
  rounded = true,
  onReloadIframe,
  onConfirm,
}: Props) {
  const [newURL, setNewURL] = useState<string>('')

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
    <CellHeader rounded={rounded}>
      <div className="flex items-center space-x-2 flex-1">
        <IconButton
          onMouseDown={onRefresh}
          icon={<RefreshIcon />}
        />
        <input
          className={`
          p-0.5
          pl-[10px]
          flex-1
          flex
          min-w-0
          placeholder:text-denim-400
          dark:placeholder:text-gray-700
          border
          border-gray-500
          dark:border-black-600
          rounded
          text-2xs
          font-400
          font-mono
          text-denim-700
          dark:text-gray-200
          bg-transparent
          outline-none
        `}
          value={newURL}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          placeholder="https://"
        />
      </div>
    </CellHeader>
  )
}

export default Header
