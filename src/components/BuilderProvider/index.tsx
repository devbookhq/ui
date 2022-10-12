import React, { PropsWithChildren, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { RecoilRoot, useRecoilValue } from 'recoil'

import { BoardBlock, getAllBlocksSelector, setBlockSelector } from './boardBlock'
import useDndBackend from './useDndBackend'

export interface BuilderProviderProps {
  id?: string
  onBlocksChange?: (blocks: BoardBlock[]) => void
  initialBlocks?: BoardBlock[]
}

interface StateSyncProps {
  id?: string
  onBlocksChange?: (blocks: BoardBlock[]) => void
}

function StateSync({ onBlocksChange }: StateSyncProps) {
  const blocks = useRecoilValue(getAllBlocksSelector)

  useEffect(
    function saveApp() {
      onBlocksChange?.(blocks)
    },
    [blocks, onBlocksChange],
  )

  return null
}

function BuilderProvider({
  children,
  onBlocksChange,
  initialBlocks,
}: PropsWithChildren<BuilderProviderProps>) {
  const backend = useDndBackend()

  return (
    <RecoilRoot
      initializeState={snap =>
        initialBlocks?.forEach(b => snap.set(setBlockSelector(b.id), b))
      }
    >
      <DndProvider backend={backend}>{children}</DndProvider>
      <StateSync onBlocksChange={onBlocksChange} />
    </RecoilRoot>
  )
}

export default BuilderProvider
