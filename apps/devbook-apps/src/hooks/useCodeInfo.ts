import { CompletionList, CompletionItem, Hover, LanguageSetup, Position, getFileURI, getLanguageSetup, useLanguageClients, SignatureHelp } from '@devbookhq/code-editor'
import { useEffect, useMemo, useState } from 'react'

export function useCodeInfo({
  filename,
  position,
  supportedLanguages,
  autocomplete,
  hover,
  signature,
}: {
  filename: string,
  position: Position,
  supportedLanguages: LanguageSetup[],
  autocomplete?: boolean,
  hover?: boolean,
  signature?: boolean,
}) {
  const languageClients = useLanguageClients()
  const languageSetup = getLanguageSetup(filename, supportedLanguages)
  const languageClient = languageSetup && languageClients?.[languageSetup?.languageID]

  const [hoverInfo, setHoverInfo] = useState<Hover | null>(null)
  const [autocompletionInfo, setAutocompletionInfo] = useState<CompletionItem[] | CompletionList | null>(null)
  const [signatureInfo, setSignatureInfo] = useState<SignatureHelp | null>(null)

  const uri = useMemo(() => getFileURI(filename), [filename])

  useEffect(function getHoverInfo() {
    if (!languageClient) return
    if (!hover) return

    languageClient.lsp.getHoverInfo({
      position,
      textDocument: {
        uri,
      },
    }).then(setHoverInfo)

  }, [
    languageClient,
    uri,
    position,
    hover,
  ])

  useEffect(function getAutocompletionInfo() {
    if (!languageClient) return
    if (!autocomplete) return

    languageClient.lsp.getCompletion({
      position,
      textDocument: {
        uri,
      },
    }).then(setAutocompletionInfo)

  }, [
    languageClient,
    uri,
    position,
    autocomplete,
  ])

  useEffect(function getSignatureInfo() {
    if (!languageClient) return
    if (!signature) return

    languageClient.lsp.getSignatureHelp({
      position,
      textDocument: {
        uri,
      },
    }).then(setSignatureInfo)

  }, [
    languageClient,
    uri,
    position,
    signature,
  ])

  return {
    hoverInfo,
    autocompletionInfo,
    signatureInfo,
  }
}
