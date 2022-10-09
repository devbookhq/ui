import { EnvVars, components } from '@devbookhq/sdk'
import { useMemo } from 'react'

import useFetch from './useFetch'

export type Language = components['schemas']['Template']

export interface Props {
  codeSnippetID?: string
  connectCodeSnippetIDs?: string[]
}

export interface PublishedCodeSnippet {
  codeSnippetID: string
  codeSnippetCode: string
  codeSnippetConnectCode: string
  codeSnippetTitle: string
  // The env vars from server are in a string format
  codeSnippetEnvVars: string
  codeSnippetTemplate: Language
}

function usePublishedCodeSnippet({ codeSnippetID, connectCodeSnippetIDs = [] }: Props) {
  const url = useMemo(() => {
    if (!codeSnippetID) return
    let embedURL = `https://embed.usedevbook.com/${codeSnippetID}/props`
    if (connectCodeSnippetIDs.length > 0) {
      embedURL += `?connect=${connectCodeSnippetIDs.join(',')}`
    }
    return embedURL
  }, [codeSnippetID, connectCodeSnippetIDs])

  const { data } = useFetch<PublishedCodeSnippet>(url)

  return useMemo(() => {
    if (!data) return undefined

    let envVars: EnvVars = {}
    if (typeof data?.codeSnippetEnvVars === 'string') {
      try {
        envVars = JSON.parse(data?.codeSnippetEnvVars)
      } catch (err) {
        console.error('Cannot parse env vars', err)
      }
    }

    return {
      ...data,
      codeSnippetEnvVars: envVars,
    }
  }, [data])
}

export default usePublishedCodeSnippet
