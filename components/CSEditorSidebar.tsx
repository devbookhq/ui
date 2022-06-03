import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import Select from 'components/Select'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'

import {
  CodeEnvironment,
  CodeSnippet,
} from 'types'

// Fetches a published code snippet from the DB, if such code snippet exists.
function getPublishedCodeSnippet(codeSnippetID: string) {

}

interface Props {
  codeSnippet: CodeSnippet
  env: CodeEnvironment
}

function CSEditorSidebar({
  codeSnippet,
  env,
}: Props) {
  const [stateTitle, setStateTitle] = useState('')

  useEffect(function updateStateTitle() {
    let t = 'Building environment...'
    switch (env.state) {
      case 'Failed':
        t = 'Failed to build environment'
      case 'Done':
        t = 'Environment ready'
    }
    setStateTitle(t)
  }, [env])

  return (
    <div className="
      max-w-[272px]
      w-full
      hidden
      lg:flex
      lg:flex-col
      lg:items-start
      lg:justify-between
    ">
      <div className="
        max-w-full
        flex
        flex-col
        items-start
        space-y-4
      ">
        {/*
        <div className="
          w-full
          flex
          flex-col
          items-start
          space-y-1
        ">
          <Title
            size={Title.size.T2}
            title="Template"
          />
          <Select/>
        </div>
        */}

        <div className="
          w-full
          flex
          flex-col
          items-start
          space-y-1
        ">
          <Title
            size={Title.size.T2}
            title="Published URL"
          />
          <a
            href={`http://localhost:3000/${encodeURIComponent(codeSnippet.slug)}`}
            className="
              max-w-full
              text-green-500
              overflow-hidden
              truncate
              text-sm
              cursor-pointer
              underline
            "
          >
            {`localhost:3000/${encodeURIComponent(codeSnippet.slug)}`}
          </a>
        </div>
      </div>
      <Title
        size={Title.size.T3}
        rank={Title.rank.Secondary}
        title={stateTitle}
      />
    </div>
  )
}

export default CSEditorSidebar
