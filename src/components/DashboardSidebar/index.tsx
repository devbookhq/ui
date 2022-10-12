import { CodeIcon, GearIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Button from 'components/Button'
import FeedbackModal from 'components/FeedbackModal'

import useUserInfo from 'hooks/useUserInfo'

import SidebarLink from './SidebarLink'

const pages = [
  {
    title: 'Apps',
    href: '/',
    activeOnPathnames: ['/'],
    icon: <CodeIcon />,
  },
]

function DashboardSidebar() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false)
  const router = useRouter()
  const { user } = useUserInfo()

  if (!user) return null
  return (
    <>
      <FeedbackModal
        isOpen={isFeedbackVisible}
        onClose={() => setIsFeedbackVisible(false)}
      />

      <div
        className="
        flex
        flex-col
        items-center
        justify-between
        border-r
        border-black-700
        py-4
      "
      >
        <div
          className="
          flex
          w-full
          flex-col
          items-start
          justify-start
          space-y-2
        "
        >
          {pages.map(p => (
            <SidebarLink
              active={p.activeOnPathnames.includes(router.pathname)}
              href={p.href}
              icon={p.icon}
              key={p.href}
              title={p.title}
            />
          ))}
        </div>

        <div
          className="
          flex
          w-full
          flex-col
          items-center
          justify-start
          space-y-4
        "
        >
          <SidebarLink
            active={router.pathname === '/settings'}
            href="/settings"
            icon={<GearIcon />}
            title="Settings"
          />
          <Button
            className="mx-2"
            text="Share feedback"
            onClick={() => setIsFeedbackVisible(true)}
          />
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
