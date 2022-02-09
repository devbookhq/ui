import {
  useState,
  useEffect,
  useCallback,
} from 'react'
import {
  Tree,
} from 'antd'
import { useDevbook } from '@devbookhq/sdk'

import {
  FSNodeType,
  SerializedFSNode,
} from './types'


export interface FilesystemProps {
  devbook: ReturnType<typeof useDevbook>
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

function Filesystem({ envID, documentEnvID }: FilesystemProps) {
  const env = useRunningEnv({ documentEnvID })
  const [serializedFS, setSerializedFS] = useState<SerializedFSNode[]>(env?.filesystem.serialize() || [])
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])

  const handleOpenFile = useCallback((path: string) => {
    throw new Error('Not implemented')
  }, [])

  // Since the filesystem serialization is triggered relatively often, we want to use `useCallback` for functions.
  const handleFSDirsChange = useCallback(({ dirPaths }: { dirPaths: string[] }) => {
    if (!env) return
    for (const dp of dirPaths) {
      const promise = promises.get(dp)
      if (promise) {
        promise.resolveHandle()
      }
    }
    setSerializedFS(env.filesystem.serialize())
  }, [env])

  const handleFSPromptConfirm = useCallback((args: { fullPath: string, name: string, type: FSNodeType }) => {
    if (!env) return

    const { fullPath, name, type } = args
    if (!name) return

    switch (type) {
      case 'File':
        Runner.obj?.createFile({
          envID: env.id,
          path: fullPath,
          content: '',
        })
        handleOpenFile(fullPath)
        break
      case 'Dir':
        Runner.obj?.createDir({
          envID: env.id,
          path: fullPath,
        })
        break
      default:
        throw new Error('Unknown node type')
    }
  }, [
    env,
    handleOpenFile,
  ])

  const handleSelectNode = useCallback((node: any) => {
    if (node.type !== 'File') return
    handleOpenFile(node.key)
  }, [handleOpenFile])

  // Triggered by `Tree` if a node doesn't have any children and is leaf.
  // Once a node has children, it won't be triggered again.
  const loadDirData = useCallback((path: string) => {
    Runner.obj?.listDir({
      envID,
      path,
    })
    const promise = createManagedPromise()
    promises.set(path, promise)
    return promise.promise as Promise<void>
  }, [envID])

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
      .then(() => {
        expandNode({ key: args.dirPath, shouldExpand: true })
      })
  }, [
    loadDirData,
    expandNode,
  ])

  useEffect(function registerFSListeners() {
    if (!env?.filesystem) return
    env.filesystem.addListener('onNewItemConfirm', handleFSPromptConfirm)
    env.filesystem.addListener('onDirsChange', handleFSDirsChange)
    env.filesystem.addListener('onShowPrompt', handleFSShowPrompt)
    return () => {
      env.filesystem.removeListener('onNewItemConfirm', handleFSPromptConfirm)
      env.filesystem.removeListener('onDirsChange', handleFSDirsChange)
      env.filesystem.removeListener('onShowPrompt', handleFSShowPrompt)
    }
  }, [
    env?.filesystem,
    handleFSPromptConfirm,
    handleFSDirsChange,
    handleFSShowPrompt,
  ])

  if (!env || !serializedFS.length) return null
  return (
    <Tree.DirectoryTree
      motion={null}
      height={500}
      expandedKeys={expandedKeys}
      treeData={serializedFS}
      loadData={e => loadDirData(e.key as string)}
      onExpand={(_, event) => expandNode({ key: event.node.key as string, shouldExpand: !event.node.expanded })}
      //titleRender={node => <TreeNodeTitle node={node as SerializedFSNode} />}
      onSelect={(_, info) => handleSelectNode(info.node)}
    />
  )
}

export default Filesystem