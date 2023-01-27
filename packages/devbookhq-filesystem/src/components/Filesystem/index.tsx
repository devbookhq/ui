import { FilesystemOperation, Session } from '@devbookhq/sdk'
import {
  useCallback,
  useEffect,
} from 'react'
import clsx from 'clsx'

import FilesystemPrimitive, {
  DirNode,
  FileNode,
  NodeType,
  SelectHandler,
  useFilesystem,
} from '../../filesystem'
import Text from '../typography/Text'

import Dir from './Dir'
import File from './File'

export interface Props {
  className?: string
  // Path where we should mount the filesytem.
  rootPath: string
  ignore?: string[]
  onFiletreeClick?: (path: string, type: NodeType) => void
  session?: Session
}

function Filesystem({
  className,
  rootPath,
  ignore,
  session,
  onFiletreeClick,
}: Props) {
  const fs = useFilesystem({ rootPath })

  const fetchDirContent = useCallback(async (dirpath: string) => {
    if (!session?.filesystem) return []

    const files = await session.filesystem?.list(dirpath)

    // TODO: Prefetch dirs one level deeper ahead.
    // So that user doesn't need to wait for fetching dir
    // content when they open it for the first time.
    const ns = files.map(f => (f.isDir ? new DirNode({ name: f.name }) : new FileNode({ name: f.name })),)
    fs.add(dirpath, ns, ignore)
  }, [
    fs,
    session?.filesystem,
    ignore,
  ])

  const watchDir = useCallback((dirpath: string) => {
    if (!session?.filesystem) return

    const watcher = session.filesystem.watchDir(dirpath)
    const unsub = watcher.addEventListener(({
      path,
      isDir,
      operation,
      name,
    }) => {
      switch (operation) {
        case FilesystemOperation.Create:
          fs.add(dirpath,
            [
              isDir
                ? new DirNode({ name })
                : new FileNode({ name }),
            ],)
          break
        case FilesystemOperation.Remove:
          fs.remove(path)
          break
        case FilesystemOperation.Write:
          // TODO
          // onContentChange(...)
          break
      }
    })
    watcher.start()
    return unsub
  }, [fs, session?.filesystem])

  const handleNodeSelect: SelectHandler = useCallback(async (_, node) => {
    // TODO: Prefetch dirs.
    const {
      type,
      path,
      metadata,
      isExpanded,
    } = node

    onFiletreeClick?.(path, type)

    // User is closing dir.
    if (isExpanded) return

    if (type === NodeType.Dir) {
      if (!metadata['isWatching']) {
        watchDir(path)
        fs.setMetadata(path, {
          key: 'isWatching',
          value: true,
        })

        if (!fs.hasChildren(path)) {
          fetchDirContent(path)
        }
      }
    } else if (type === NodeType.File) {
      // TODO: Open file
    }
  },
    [
      fs,
      watchDir,
      onFiletreeClick,
      fetchDirContent,
    ],)

  useEffect(function mountFilesystem() {
    if (!session?.filesystem) return
    const unsub = watchDir(rootPath)
    fetchDirContent(rootPath)
    return () => {
      unsub?.()
    }
  }, [
    rootPath,
    session?.filesystem,
    fs,
    watchDir,
    fetchDirContent,
  ])

  return (
    <div className="
      mt-2
      flex
      flex-col
      space-y-2
      py-2
      bg-gray-800
      rounded-lg
    ">
      <div className="
        pl-3
        pb-2
        flex
        items-center
        border-b
        border-gray-700
      ">
        <Text
          className="text-gray-500"
          size={Text.size.S3}
          text={rootPath.toUpperCase()}
          typeface={Text.typeface.InterSemibold}
        />
      </div>
      <FilesystemPrimitive.Tree
        className={clsx(
          'px-2',
          'flex-1',
          'flex',
          'flex-col',
          'space-y-2',
          'lg:space-y-1',
          'overflow-y-auto',
          className,
        )}
        dir={Dir}
        file={File}
        fs={fs}
        onSelect={handleNodeSelect}
      />
    </div>
  )
}

export default Filesystem
