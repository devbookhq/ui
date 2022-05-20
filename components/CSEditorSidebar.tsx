import Select from 'components/Select'
import Title from 'components/typography/Title'

import type { CodeSnippet } from 'types'

interface Props {
  codeSnippet: CodeSnippet
}

function postEnv(codeSnippetID: string, runtime: string) {
  const body = {
    'code_snippet_id': codeSnippetID,
    runtime,
    deps: [],
  }
  fetch('https://orchestration-api-7d2cl2hooq-uc.a.run.app/env', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  //.then(response => response.json())
  //.then((data: any) => {
  //  if (data.statusCode === 500 && data.message) {
  //    throw new Error(data.message)
  //  }
  //  router.push(`/dashboard/${encodeURIComponent(data.slug)}/edit?tab=code`)
  //})
  //.catch(err => {
  //  showErrorNotif(`Error: ${err.message}`)
  //  setIsLoadingNewSnippet(false)
  //})
}

function CSEditorSidebar({
  codeSnippet,
}: Props) {
  return (
    <div className="
      max-w-[272px]
      w-full
      hidden
      lg:flex
      lg:flex-col
      lg:items-start
      lg:space-y-4
    ">
      <div className="
        w-full
        flex
        flex-col
        items-start
        space-y-1
      ">
        <Title
          size={Title.size.T2}
          title="Runtime"
        />
        <Select/>
      </div>

      <div className="
        w-full
        flex
        flex-col
        items-start
        space-y-1
      ">
        <Title
          size={Title.size.T2}
          title="Public URL"
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
  )
}

export default CSEditorSidebar
