import {
  Dropdown,
  Menu,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import {
  SerializedFSNode
} from './types'

export interface TreeNodeTitleProps {
  node: SerializedFSNode
}

function TreeNodeTitle({
  node,
}: TreeNodeTitleProps) {
  const menu = (
    <Menu
      onClick={(e) => {
        // The context menu might get displayed on top of the tree node so we want
        // to prevent the DOM event to propagate there and trigger click events.
        e.domEvent.stopPropagation()
      }}
    >
      <Menu.Item
        key="1"
        icon={<EditOutlined />}
      >
        Rename
      </Menu.Item>
      <Menu.Item
        key="2"
        danger
        icon={<DeleteOutlined />}
      >
        Delete
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown
      trigger={['contextMenu']}
      overlay={menu}
    >
      <span
        className="flex flex-1"
      >
        {node.title}
      </span>
    </Dropdown>
  )
}

export default TreeNodeTitle
