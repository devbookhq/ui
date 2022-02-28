import type { FS } from '@devbookhq/sdk/lib/cjs/core'

import { default as FilesystemNamePrompt } from './FilesystemNamePrompt'
import { default as FilesystemDir } from './FilesystemDir'
import FilesystemTree from './FilesystemTree'


import {
  useRef,
  memo,
  useEffect,
} from 'react'

import Header from '../Editor/Header'
import Separator from '../Separator'

export interface Props {
  lightTheme?: boolean
  fs: FS
  height?: number // in px
  onOpenFile: (filepath: string) => void
}

function Editor({
  fs,
  lightTheme,
  height,
  onOpenFile,
}: Props) {

  return (
    <div className={`rounded ${lightTheme ? '' : 'dark'}`}>
      <Header
        filepath={filepath}
      />
      <Separator
        variant={Separator.variant.CodeEditor}
        dir={Separator.dir.Horizontal}
      />
      <div
        className={`flex-1 flex max-h-full min-w-0 overflow-auto devbook ${filepath ? 'rounded-b' : 'rounded'}`}
        style={{
          ...height && { height: `${height}px` },
        }}
      >
        <FilesystemTree
          filesystem={fs}
          onOpenFile={onOpenFile}
        />
      </div>
    </div>
  )
}

export default Editor
