import {
  MouseEvent,
  useState,
} from 'react'

import RefreshIcon from '../RefreshIcon'
import IconButton from '../IconButton'
import CellHeader from '../CellHeader'
import Text from '../Text'

export interface Props {
  url?: string
  onReloadIframe: (e: MouseEvent) => void
}

function Header({
  url = '',
  onReloadIframe,
}: Props) {

  return (
    <CellHeader>
      <div className="flex items-center space-x-2">
        <IconButton
          onMouseDown={onReloadIframe}
          icon={<RefreshIcon />}
        />
        <Text
          mono
          hierarchy={Text.hierarchy.Secondary}
          size={Text.size.Small}
          text={url}
        />
      </div>
    </CellHeader>
  )
}

export default Header
