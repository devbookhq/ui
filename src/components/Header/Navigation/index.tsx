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
    <div className="flex items-center space-x-1">
      <HeaderLink
        active={router.pathname === '/'}
        href="/"
        title="Apps"
      />
      {app && (
        <>
          <ChevronRight
            className="items-center text-slate-200"
            size="16px"
          />
          <Text
            className="whitespace-nowrap"
            size={Text.size.T2}
            text={app.title}
          />
        </>
      )}
    </div>
  )
}

export default Navigation
