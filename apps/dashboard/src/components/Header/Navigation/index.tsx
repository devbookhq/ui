import { apps } from '@prisma/client'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'

import HeaderLink from './HeaderLink'

export interface Props {
  app?: apps
}

function Navigation({ app }: Props) {
  const router = useRouter()

  return (
    <div className="flex items-center space-x-2">
      <HeaderLink
        active={router.pathname === '/projects'}
        href="/projects"
        title="Projects"
      />
      {app && (
        <>
          <ChevronRight
            className="items-center text-slate-200"
            size="16px"
          />
          <HeaderLink
            active={router.pathname === '/projects/[id]'}
            href={{
              pathname: '/projects/[id]',
              query: {
                id: app.id,
              },
            }}
            title={app.title}
          />
        </>
      )}
    </div>
  )
}

export default Navigation
