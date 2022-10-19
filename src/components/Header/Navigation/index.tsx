import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'

import Title from 'components/typography/Title'

import { App } from 'utils/queries/types'

import HeaderLink from './HeaderLink'

export interface Props {
  app?: App
}

function Navigation({ app }: Props) {
  const router = useRouter()

  return (
    <div className="-mb-px flex items-center space-x-2">
      <HeaderLink
        active={router.pathname === '/'}
        href="/"
        title="Apps"
      />
      {app && (
        <>
          <div>
            <ChevronRight
              className="text-gray-400"
              size="16px"
            />
          </div>
          <Title
            className="whitespace-nowrap"
            rank={Title.rank.Primary}
            size={Title.size.T3}
            title={app.title}
          />
        </>
      )}
    </div>
  )
}

export default Navigation
