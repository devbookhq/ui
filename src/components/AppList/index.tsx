import React, { useMemo } from 'react'

import { App } from 'queries/types'

import AppItem from './AppItem'

export interface Props {
  apps: Required<App>[]
}

function AppList({ apps }: Props) {
  const sorted = useMemo(
    () =>
      apps.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [apps],
  )

  return (
    <div
      className="
      scroller
      flex
      max-w-[800px]
      flex-1
      flex-col
      space-y-1
      overflow-auto
      pr-4
    "
    >
      {sorted.map(app => (
        <div
          className="flex flex-col space-y-2 px-1 pt-1"
          key={app.id}
        >
          <AppItem app={app} />
          <div className="border-b border-slate-100" />
        </div>
      ))}
    </div>
  )
}

export default AppList
