import {
  EnvVars,
  components,
} from '@devbookhq/sdk'

import useFetch from './useFetch'

export type Language = components['schemas']['Template']

export interface Props {
  codeSnippetID: string
  insertedCodeSnippetIDs?: string[]
}

export interface PublishedCodeSnippet {
  codeSnippetID: string
  codeSnippetEditorCode: string
  codeSnippetRunCode: string
  codeSnippetTitle: string
  codeSnippetEnvVars: EnvVars
  codeSnippetTemplate: Language
}

function usePublishedCodeSnippet({
  codeSnippetID,
  insertedCodeSnippetIDs = [],
}: Props) {
  let url = `https://embed.usedevbook.com/${codeSnippetID}/props`
  if (insertedCodeSnippetIDs.length > 0) {
    url += insertedCodeSnippetIDs.join(',')
  }

  const { data } = useFetch<PublishedCodeSnippet>(url)
  return data
}

export default usePublishedCodeSnippet
