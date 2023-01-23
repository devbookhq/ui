import { ChevronRight } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'

import Text from 'components/typography/Text'

import { App } from 'queries/types'

import { useEditorControls } from '../EditorControlsProvider'
import HeaderLink from './HeaderLink'
import { getSlug } from 'utils/app'

export interface Props {
  app?: App
}

function Navigation({ app }: Props) {
  const router = useRouter()

  const { instance } = useEditorControls()

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
      {instance?.board?.name && instance.pages.length > 1 && (
        <>
          <ChevronRight
            className="items-center text-slate-200"
            size="16px"
          />
          <Text
            className="whitespace-nowrap"
            size={Text.size.S3}
            text={instance.board.name}
          />
        </>
      )}
    </div>
  )
}

export default observer(Navigation)
