import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  CodeIcon,
  GearIcon,
  BarChartIcon,
} from '@radix-ui/react-icons'

import Button from 'components/Button'
import FeedbackModal from 'components/FeedbackModal'
import useUserInfo from 'utils/useUserInfo'
import SidebarLink from './SidebarLink'

const pages = [
  {
    title: 'Code Snippets',
    href: '/',
    activeOnPathnames: ['/', '/[slug]/edit'],
    icon: <CodeIcon/>,
  },
  {
    title: 'Insights',
    href: '/insights',
    activeOnPathnames: ['/insights'],
    icon: <BarChartIcon/>,
  },
]

function DashboardSidebar() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false)
  const router = useRouter()
  const { user } = useUserInfo()

  // Don't display sidebar on the public code snippet page.
  if (router.pathname === '/[slug]') return null
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
          space-y-2
        ">
          {pages.map(p => (
            <SidebarLink
              key={p.href}
              title={p.title}
              href={p.href}
              active={p.activeOnPathnames.includes(router.pathname)}
              icon={p.icon}
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
            icon={<GearIcon/>}
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
