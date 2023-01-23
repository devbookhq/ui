import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'

import { App } from 'queries/types'
import { getSlug } from 'utils/app'

import HeaderLink from './HeaderLink'

export interface Props {
  app?: App
}

function Navigation({ app }: Props) {
  const router = useRouter()

  return (
    <div className="flex items-center space-x-2">
      {!app &&
        <>
          <HeaderLink
            active={router.pathname === '/envs'}
            href="/envs"
            title="Envs"
          />
          <HeaderLink
            active={router.pathname === '/projects'}
            href="/projects"
            title="Projects"
          />
        </>
      }
      {app && (
        <>
          <HeaderLink
            active={router.pathname === '/envs'}
            href="/envs"
            title="Envs"
          />
          <HeaderLink
            active={router.pathname === '/projects'}
            href="/projects"
            title="Projects"
          />
          <ChevronRight
            className="items-center text-slate-200"
            size="16px"
          />
          <HeaderLink
            active={router.pathname === '/projects/[slug]'}
            href={{
              pathname: '/projects/[slug]',
              query: {
                slug: getSlug(app.id, app.title)
              }
            }}
            title={app.title}
          />
        </>
      )}
    </div>
  )
}

export default Navigation
