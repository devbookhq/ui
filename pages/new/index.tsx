import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import TitleLink from 'components/TitleLink'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import CodeEditor from 'components/CodeEditor'
import CodeIcon from 'components/icons/Code'
import BoxIcon from 'components/icons/Box'

const tabs = [
  {
    key: 'code',
    title: 'Code',
    icon: <CodeIcon/>,
  },
  {
    key: 'env',
    title: 'Environment',
    icon: <BoxIcon/>,
  },
]

export const getServerSideProps = withAuthRequired({
  redirectTo: '/signin',
  // Linter won't allow to create a build unless we have an async here.
  async getServerSideProps(ctx) {
    const { tab } = ctx.query
    if (!tab || !tabs.find(t => t.key === tab)) {
      return {
        redirect: {
          destination: `/new?tab=${tabs[0].key}`,
          permanent: false,
        }
      }
    }
    return {
      props: {},
    }
  }
})

function New() {
  const router = useRouter()
  const currentTab = router.query.tab
  return (
    <>
      {/* Fake breadcrumbs */}
      <div className="
        flex-1
        flex
        flex-col
        space-y-6
      ">
        <div className="
          flex
          items-center
          space-x-2
          min-h-[48px]
        ">
          <TitleLink
            href="/"
            title="Code Snippets"
          />
          <Title title="/"/>
          <Title title="New"/>
        </div>

        <div className="
          flex-1
          flex
          flex-col
          space-y-4
          md:flex-row
          md:space-y-0
          md:space-x-4
        ">
          <div className="
            flex
            flex-row
            items-center
            justify-start
            space-x-4

            md:flex-col
            md:items-start
            md:space-x-0
            md:space-y-4
          ">
            {tabs.map(t => (
              <TitleLink
                key={t.key}
                href={`/new?tab=${t.key}`}
                title={t.title}
                icon={t.icon}
                size={TitleLink.size.T3}
                active={t.key === currentTab}
                shallow
              />
            ))}
          </div>
          <div className="
            flex-1
            relative
            overflow-hidden
            bg-black-800
            border-black-700
            border
            rounded-lg
          ">
            <CodeEditor
              content="const a = 5;"
              className="
                absolute
                inset-0
              "
            />
          </div>
          <div className="
            hidden
            lg:flex
            lg:flex-col
            lg:items-start
            lg:space-y-4
          ">
            <Text
              text="URL will go here"
            />
            <Text
              text="Embed will go here"
            />
          </div>
        </div>
      </div>
    </>
  )
}


export default New
