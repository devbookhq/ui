import {
  MouseEvent,
  useState,
} from 'react'
import {
  DeleteOutlined,
  LinkOutlined,
  ReloadOutlined,
} from '@ant-design/icons'

import IconButton from 'src/components/IconButton'
import CellHeader from 'src/components/CellHeader'
import Text from 'src/components/typography/Text'

import URLModal from './URLModal'

export interface Props {
  url: string
  onURLConfirm: (url: string) => void
  onDeleteMouseDown: (e: MouseEvent) => void
  onReloadIframe: (e: MouseEvent) => void
}

function Header({
  url,
  onURLConfirm,
  onDeleteMouseDown,
  onReloadIframe,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  function hideModal() {
    setIsModalVisible(false)
  }

  function toggleModal(e: any) {
    // This makes sure that we don't steal focus from the iframe's URL modal once it appears.
    e.preventDefault()
    setIsModalVisible(val => !val)
  }

  function handleURLConfirm(url: string) {
    hideModal()
    onURLConfirm(url)
  }

  return (
    <CellHeader
      sideButtons={
        <>
          <IconButton
            onMouseDown={onDeleteMouseDown}
            icon={<DeleteOutlined className="text-2xs" />}
          />
        </>
      }
    >
      <div className="flex items-center space-x-2">
        <URLModal
          url={url}
          onConfirm={handleURLConfirm}
          visible={isModalVisible}
          onClickOutside={hideModal}
        >
          <IconButton
            onMouseDown={toggleModal}
            icon={<LinkOutlined className="text-2xs" />}
          />
        </URLModal>
        <IconButton
          onMouseDown={onReloadIframe}
          icon={<ReloadOutlined className="text-2xs" />}
        />
        <Text
          mono
          hierarchy={Text.hierarchy.Secondary}
          size={Text.size.Small}
          text={url || 'no URL set'}
        />
      </div>
    </CellHeader>
  )
}

export default Header
