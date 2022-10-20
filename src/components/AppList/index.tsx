import { useMemo } from 'react'

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
      flex
      flex-col
      items-start
      justify-start
      space-y-4
    "
    >
      {sorted.map(app => (
        <AppItem
          app={app}
          key={app.id}
        />
      ))}
    </div>
  )
}

export default AppList
