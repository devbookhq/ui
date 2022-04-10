import { MouseEvent } from 'react'
import {
  FileAddOutlined,
  FolderAddOutlined,
} from '@ant-design/icons'

import Text from '../../Text'
import ContextButton from './ContextButton'

export interface Props {
  name: string;
  onAddFileMouseDown: (e: MouseEvent) => void;
  onAddDirMouseDown: (e: MouseEvent) => void;
}

function FilesystemDir({
  name,
  onAddFileMouseDown,
  onAddDirMouseDown,
}: Props) {
  return (
    <div
      className="
        group
        flex
        flex-1
        truncate
        justify-between
        items-center
      "
    >
      <Text text={name} />
      <div
        className="
          invisible
          flex
          align-center
          space-x-1
          group-hover:visible
        "
      >
        <ContextButton
          onMouseDown={onAddDirMouseDown}
          // This makes sure that the click event doesn't open the tree node.
          onClick={e => e.stopPropagation()}
          // We are very manually overiding styling here because the Ant's folder button doesn't
          // look good next to the file button.
          icon={<FolderAddOutlined className="text-[15px]" />}
        />
        <ContextButton
          onMouseDown={onAddFileMouseDown}
          // This makes sure that the click event doesn't open the tree node.
          onClick={e => e.stopPropagation()}
          icon={<FileAddOutlined />}
        />
      </div>
    </div>
  )
}

export default FilesystemDir
