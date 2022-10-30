import React, { PropsWithChildren } from 'react'

import EnvironmentProvider from 'components/EnvironmentProvider'

import RootStoreProvider, {
  Props as RootStoreProviderProps,
} from './EditorProvider/models/RootStoreProvider'

export interface Props extends Pick<RootStoreProviderProps, 'initialState'> {}

function ViewProvider({ children, ...rest }: PropsWithChildren<Props>) {
  return (
    <RootStoreProvider {...rest}>
      <EnvironmentProvider>{children}</EnvironmentProvider>
    </RootStoreProvider>
  )
}

export default ViewProvider
