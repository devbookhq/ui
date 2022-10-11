import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useEffect } from 'react'

import { updateApp } from 'utils/queries/queries'
import { App } from 'utils/queries/types'

import { useBoard } from '../../BuilderProvider/useBoard'
import { renderBoardItem } from '../UIComponent'

export interface Props {
  app: App
}

function Container({ app }: Props) {
  const [items, ref] = useBoard(app.serialized)

  useEffect(
    function saveApp() {
      updateApp(supabaseClient, { serialized: items, id: app.id })
    },
    [items, app.id],
  )

  return (
    <div
      className="board relative flex flex-1"
      ref={ref}
    >
      {Object.values(items).map(item => renderBoardItem(item))}
    </div>
  )
}

export default Container
