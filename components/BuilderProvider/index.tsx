import React, { PropsWithChildren } from 'react'
import { DndProvider } from 'react-dnd'
import { RecoilRoot } from 'recoil'

import useDndBackend from './useDndBackend'

export interface BuilderProviderProps {}

function BuilderProvider({ children }: PropsWithChildren<BuilderProviderProps>) {
  const backend = useDndBackend()

  return (
    <RecoilRoot>
      <DndProvider backend={backend}>{children}</DndProvider>
    </RecoilRoot>
  )
}

export default BuilderProvider
