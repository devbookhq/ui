import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import { tabs, Tab } from 'utils/newCodeSnippetTabs'
import NewCodeSnippetContent from 'components/NewCodeSnippetContent'
import TitleLink from 'components/TitleLink'
import Title from 'components/typography/Title'
import Button from 'components/Button'

export const getServerSideProps = withAuthRequired({
  redirectTo: '/signin',
  // NOTE: Linter won't allow to create a build unless we have an async here.
  // Redirect user to the `?tab=code` if no valid tab query is present.
  async getServerSideProps(ctx) {
    const { tab } = ctx.query
    if (!tab || !Object.entries(tabs).find(([key, val]) => val.key === tab)) {
      return {
        redirect: {
          destination: `/new?tab=${tabs.code.key}`,
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
  const [code, setCode] = useState('')
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
          justify-between
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
          <Button
            variant={Button.variant.Full}
            text="Create"
          />
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
            {Object.entries(tabs).map(([key, val]) => (
              <TitleLink
                key={val.key}
                href={`/new?tab=${val.key}`}
                title={val.title}
                icon={val.icon}
                size={TitleLink.size.T3}
                active={val.key === currentTab}
                shallow
              />
            ))}
          </div>

          <NewCodeSnippetContent
            code={code}
            onContentChange={setCode}
          />
        </div>
      </div>
    </>
  )
}

export default New
