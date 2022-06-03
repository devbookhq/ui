import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import type {
  PublishedCodeSnippet,
  CodeSnippet,
} from 'types'
import {
  CodeEnvironment,
} from 'types'
import SpinnerIcon from 'components/icons/Spinner'
import Button from 'components/Button'
import Select from 'components/Select'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import { showErrorNotif } from 'utils/notification'

// Fetches a published code snippet from the DB, if such code snippet exists.
function getPublishedCodeSnippet(codeSnippetID: string) {
  return supabaseClient
  .from<PublishedCodeSnippet>('published_code_snippets')
  .select('*')
  .eq('code_snippet_id', codeSnippetID)
}

async function upsertPublishedCodeSnippet(cs: PublishedCodeSnippet) {
  const { body, error } = await supabaseClient
    .from<PublishedCodeSnippet>('published_code_snippets')
    .upsert(cs)
  if (error) throw error
  return body[0]
}

interface Props {
  codeSnippet: CodeSnippet
  latestCode: string
  env: CodeEnvironment
}

function CSEditorSidebar({
  codeSnippet,
  latestCode,
  env,
}: Props) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [stateTitle, setStateTitle] = useState('')
  const [publishedCS, setPublishedCS] = useState<PublishedCodeSnippet | null>(null)

  useEffect(function getPublishedCS() {
    if (!codeSnippet) return
    getPublishedCodeSnippet(codeSnippet.id)
    .then(({ data, error }) => {
      if (error) {
        console.error(error)
        showErrorNotif(`Error: ${error.message}`)
      }
      if (data && data.length > 0) {
        setPublishedCS(data[0])
      }
    })
  }, [codeSnippet])

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

  async function publish() {
    try {
      if (!codeSnippet) throw new Error('Cannot publish code snippet - code snippet is undefined')
      if (isPublishing) return
      setIsPublishing(true)

      const newPCS: PublishedCodeSnippet = {
        id: publishedCS?.id,
        published_at: publishedCS?.published_at,
        code_snippet_id:  codeSnippet.id,
        title: codeSnippet.title,
        code: latestCode,
      }
      const pcs = await upsertPublishedCodeSnippet(newPCS)
      setPublishedCS(pcs)
      alert('Code snippet published')
    } catch (err: any) {
      showErrorNotif(`Error: ${err.message}`)
    } finally {
      setIsPublishing(false)
    }
  }

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
        w-full
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
          space-y-2
        ">
          <div className="
            w-full
            flex
            flex-row
            items-center
            justify-between
          ">
            <Title
              size={Title.size.T2}
              title="Published URL"
            />
            <Button
              icon={isPublishing && <SpinnerIcon/>}
              text={isPublishing ? 'Publishing...' : 'Publish'}
              onClick={publish}
            />
          </div>
          {publishedCS
          ? (
            <a
              href={`localhost:3000/${encodeURIComponent(publishedCS.title)}-${publishedCS.code_snippet_id}`}
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
              {`localhost:3000/${encodeURIComponent(publishedCS.title)}-${publishedCS.code_snippet_id}`}
            </a>
          )
          : (
            <Title
              title="Not published yet"
              size={Title.size.T3}
              rank={Title.rank.Secondary}
            />
          )}
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
