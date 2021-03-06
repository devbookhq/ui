import {
  useState,
  useEffect,
  useCallback,
  createElement,
} from 'react'
import {
  Tree,
} from 'antd'
import {
  FileOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import type {
  CreateFilesystemComponent,
  CreateFilesystemPrompt,
  CreateFilesystemIcon,
} from '@devbookhq/sdk/lib/esm/core/runningEnvironment/filesystem/filesystemNode'
import type { FS } from '@devbookhq/sdk/lib/esm/core'

import {
  FSNodeType,
  SerializedFSNode,
} from './types'

import FilesystemDir from './FilesystemDir'
import FilesystemNamePrompt from './FilesystemNamePrompt'

export interface FilesystemProps {
  filesystem: FS
  onOpenFile: (filepath: string) => void
}

function createManagedPromise<T = void>() {
  let resolveHandle: ((value: T) => void) | undefined
  let rejectHandle: ((error: any) => void) | undefined
  const promise = new Promise((resolve, reject) => {
    resolveHandle = resolve
    rejectHandle = reject
  })

  if (!resolveHandle) throw new Error('`resolveHandle` is undefined')
  if (!rejectHandle) throw new Error('`rejectHandle` is undefined')

  return {
    resolveHandle,
    rejectHandle,
    promise,
  }
}

const promises = new Map<string, any>()

const createComponent: CreateFilesystemComponent = (args) => {
  return createElement(FilesystemDir, args)
}

const createPrompt: CreateFilesystemPrompt = (args) => {
  return createElement(FilesystemNamePrompt, args)
}

const createIcon: CreateFilesystemIcon = (args) => {
  return args.type === 'File'
    ? createElement(FileOutlined)
    : createElement(FolderOutlined)
}

function FileExplorer({
  onOpenFile,
  filesystem,
}: FilesystemProps) {
  const [serializedFS, setSerializedFS] = useState<SerializedFSNode[]>(filesystem.serialize(createComponent, createPrompt, createIcon) || [])
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])

  const handleOpenFile = useCallback((filepath: string) => {
    onOpenFile(filepath)
  }, [onOpenFile])

  // Since the filesystem serialization is triggered relatively often, we want to use `useCallback` for functions.
  const handleFSDirsChange = useCallback(({ dirPaths }: { dirPaths: string[] }) => {
    for (const dp of dirPaths) {
      const promise = promises.get(dp)
      if (promise) {
        promise.resolveHandle()
      }
    }
    setSerializedFS(filesystem.serialize(createComponent, createPrompt, createIcon))
  }, [filesystem])

  const handleFSPromptConfirm = useCallback((args: { fullPath: string, name: string, type: FSNodeType }) => {
    const { fullPath, name, type } = args
    if (!name) return

    switch (type) {
      case 'File':
        filesystem.write(fullPath, '')
        handleOpenFile(fullPath)
        break
      case 'Dir':
        filesystem.createDir(fullPath)
        break
      default:
        throw new Error('Unknown node type')
    }
  }, [
    handleOpenFile,
    filesystem,
  ])

  const handleSelectNode = useCallback((node: any) => {
    if (node.type !== 'File') return
    handleOpenFile(node.key)
  }, [handleOpenFile])

  // Triggered by `Tree` if a node doesn't have any children and is leaf.
  // Once a node has children, it won't be triggered again.
  const loadDirData = useCallback((path: string) => {
    filesystem.listDir(path)
    const promise = createManagedPromise()
    promises.set(path, promise)
    return promise.promise as Promise<void>
  }, [filesystem])

  const expandNode = useCallback((args: { key: string, shouldExpand: boolean }) => {
    const { key, shouldExpand } = args
    if (shouldExpand) {
      setExpandedKeys(val => {
        if (val.includes(key)) return val
        else return [...val, key]
      })
    } else {
      setExpandedKeys(val => {
        return val.filter(k => k !== key)
      })
    }
  }, [])

  const handleFSShowPrompt = useCallback((args: { dirPath: string }) => {
    // User might be adding a new file or dir to a directory which they haven't expanded yet.
    // That means that we haven't loaded the directory's children yet.
    loadDirData(args.dirPath)
      ?.then(() => {
        expandNode({ key: args.dirPath, shouldExpand: true })
      })
  }, [
    loadDirData,
    expandNode,
  ])

  useEffect(function registerFSListeners() {
    filesystem.addListener('onNewItemConfirm', handleFSPromptConfirm)
    filesystem.addListener('onDirsChange', handleFSDirsChange)
    filesystem.addListener('onShowPrompt', handleFSShowPrompt)
    return () => {
      filesystem.removeListener('onNewItemConfirm', handleFSPromptConfirm)
      filesystem.removeListener('onDirsChange', handleFSDirsChange)
      filesystem.removeListener('onShowPrompt', handleFSShowPrompt)
    }
  }, [
    filesystem,
    handleFSPromptConfirm,
    handleFSDirsChange,
    handleFSShowPrompt,
  ])

  if (!serializedFS.length) return null

  return (
    <Tree.DirectoryTree
      motion={null}
      className="w-full devbook-filesystem"
      expandedKeys={expandedKeys}
      treeData={serializedFS}
      loadData={(e) => loadDirData(e.key.toString())}
      onExpand={(_, event) => expandNode({ key: event.node.key.toString(), shouldExpand: !event.node.expanded })}
      onSelect={(_, info) => handleSelectNode(info.node)}
    />
  )
}

export default FileExplorer
