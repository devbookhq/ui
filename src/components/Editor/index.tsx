import { SessionProvider } from '@devbookhq/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useCallback } from 'react'

import BuilderProvider from 'components/BuilderProvider'
import { BoardBlock } from 'components/BuilderProvider/boardBlock'

import { updateApp } from 'utils/queries/queries'
import { App } from 'utils/queries/types'

import Board from './Board'
import Inspector from './Inspector'
import Sidebar from './Sidebar'

export interface Props {
  app: App
}

function Editor({ app }: Props) {
  const saveBlocks = useCallback(
    (blocks: BoardBlock[]) => {
      updateApp(supabaseClient, { serialized: { blocks }, id: app.id })
    },
    [app.id],
  )
  return (
    <div className="flex flex-1 rounded border border-black-700">
      <BuilderProvider
        initialBlocks={app.serialized.blocks}
        onBlocksChange={saveBlocks}
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
