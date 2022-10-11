import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import React, { PropsWithChildren, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import {
  RecoilRoot,
  SerializableParam,
  atom,
  atomFamily,
  useRecoilSnapshot,
} from 'recoil'

import { updateApp } from 'utils/queries/queries'

import { BoardBlock } from './BoardBlock'
import useDndBackend from './useDndBackend'

export interface BuilderProviderProps {
  id?: string
}

// https://github.com/recruit-tech/recoil-sync-next

const blockFamily = atomFamily<BoardBlock, SerializableParam>({
  key: 'Block',
})

interface StateSyncProps {
  id?: string
}

const board = atom({
  key: 'Board',
})

const editor = atom({
  key: 'Editor',
  default: {
    top: 0,
    left: 0,
  },
})

const selection = atom<BoardBlock | undefined>({
  key: 'Editor/selection',
  default: undefined,
})

function StateSync({ id }: StateSyncProps) {
  const serialized = useRecoilSnapshot()

  useEffect(
    function saveApp() {
      if (!id) return
      updateApp(supabaseClient, { serialized, id })
    },
    [serialized, id],
  )

  return null
}

function BuilderProvider({ children, id }: PropsWithChildren<BuilderProviderProps>) {
  const backend = useDndBackend()

  return (
    <RecoilRoot>
      <StateSync />
      <DndProvider backend={backend}>{children}</DndProvider>
    </RecoilRoot>
  )
}

export default BuilderProvider
