import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'

import Text from 'components/typography/Text'

import { App } from 'queries/types'

import HeaderLink from './HeaderLink'

export interface Props {
  app?: App
}

function Navigation({ app }: Props) {
  const router = useRouter()

  return (
    <div className="flex items-center space-x-2">
      <HeaderLink
        active={router.pathname === '/'}
        href="/"
        title="Apps"
      />
      {app && (
        <>
          <div>
            <ChevronRight
              className="text-slate-400"
              size="16px"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Text
              className="whitespace-nowrap"
              size={Text.size.T2}
              text={app.title}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Navigation
