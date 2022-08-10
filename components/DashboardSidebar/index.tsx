import { useState } from 'react'
import { useRouter } from 'next/router'

import Button from 'components/Button'
import FeedbackModal from 'components/FeedbackModal'
import useUserInfo from 'utils/useUserInfo'
import SidebarLink from './SidebarLink'

const pages = [
  {
    title: 'Code Snippets',
    href: '/',
    activeOnPathnames: ['/', '/[slug]/edit']
  },
  {
    title: 'Analytics',
    href: '/analytics',
    activeOnPathnames: ['/analytics', '/analytics/[slug]']
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

      <div className="
        py-4
        border-r
        border-black-700
        flex
        flex-col
        items-center
        justify-between
      ">
        <div className="
          w-full
          flex
          flex-col
          items-start
          justify-start
          space-y-4
        ">
          {pages.map(p => (
            <SidebarLink
              key={p.href}
              title={p.title}
              href={p.href}
              active={p.activeOnPathnames.includes(router.pathname)}
            />
          ))}
        </div>

        <div className="
          w-full
          flex
          flex-col
          items-center
          justify-start
          space-y-4
        ">
          <SidebarLink
            title="Settings"
            href="/settings"
            active={router.pathname === '/settings'}
          />
          <Button
            text="Share feedback"
            onClick={() => setIsFeedbackVisible(true)}
          />
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
