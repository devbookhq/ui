import Link from 'next/link'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import TitleLink from 'components/TitleLink'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import CodeEditor from 'components/CodeEditor'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function New() {
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
          md:flex-row
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
            <Text
              text="Code"
            />
            <Text
              text="Design"
            />
            <Text
              text="Environment"
            />
            <Text
              text="Analytics"
            />
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
