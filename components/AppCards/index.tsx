import { useMemo } from 'react'
import { App } from 'types'

import Card from './Card'

export interface Props {
  apps: Required<App>[]
}

function AppCards({ apps }: Props) {
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

      md:flex-row
      md:flex-wrap
      md:gap-4
      md:space-y-0
    "
    >
      {sorted.map(app => (
        <Card
          app={app}
          key={app.id}
        />
      ))}
    </div>
  )
}

export default AppCards
