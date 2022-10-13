import { SessionProvider } from '@devbookhq/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import debounce from 'lodash/debounce'
import { useCallback } from 'react'

import { updateApp } from 'utils/queries/queries'
import { App } from 'utils/queries/types'

import BuilderProvider from 'core/BuilderProvider'
import { RootState } from 'core/BuilderProvider/models/RootStoreProvider'

import Board from './Board'
import Inspector from './Inspector'
import Sidebar from './Sidebar'

export interface Props {
  app: App
}

const saveToDBDebounce = 1_000 // 1000ms
const saveToDBMaxInterval = 3_000 // 3000ms

const debouncedUpdateApp = debounce(updateApp, saveToDBDebounce, {
  maxWait: saveToDBMaxInterval,
  leading: false,
  trailing: true,
})

function Editor({ app }: Props) {
  const saveAppState = useCallback(
    (state: RootState) => {
      debouncedUpdateApp(supabaseClient, { state, id: app.id })
    },
    [app.id],
  )
  return (
    <div className="flex flex-1 rounded border border-black-700">
      <BuilderProvider
        initialState={app.state}
        onStateChange={saveAppState}
      >
        <SessionProvider
          opts={{
            codeSnippetID: 'Mh3XS5Pq9ch8',
          }}
        >
          <div className="flex flex-1 flex-col">
            <Board app={app} />
            <Inspector />
          </div>
          <Sidebar />
        </SessionProvider>
      </BuilderProvider>
    </div>
  )
}

export default Editor
