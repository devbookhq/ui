import { useUser } from '@supabase/supabase-auth-helpers/react'
import Link from 'next/link'
import randomColor from 'randomcolor'
import { useMemo } from 'react'

import EditorPreviewSwitch from 'components/EditorPreviewSwitch'
import UserIndicator from 'components/UserIndicator'

import { App } from 'utils/queries/types'

import Navigation from './Navigation'

export interface Props {
  app?: App
}

function Header({ app }: Props) {
  const { user } = useUser()

  const color = useMemo(
    () => randomColor({ luminosity: 'dark', seed: user?.id }),
    [user?.id],
  )

  return (
    <div className="flex justify-between border-b border-gray-200 px-4">
      <Navigation app={app} />
      <div className="flex items-center space-x-4">
        <EditorPreviewSwitch />
        <Link
          href={{
            pathname: '/settings',
          }}
          passHref
        >
          <a>
            <UserIndicator
              color={color}
              size={UserIndicator.size.Large}
              userDisplayName={user?.email}
            />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Header
