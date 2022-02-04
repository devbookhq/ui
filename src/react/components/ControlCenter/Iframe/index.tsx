import {
  useEffect,
  useRef, useState,
} from 'react'
import { useDevbook, Env } from '@devbookhq/sdk'

import SpinnerIcon from '../../SpinnerIcon'

import Header from './Header'
import IframeEl, { IframeElHandle } from './IframeEl'

export interface Props {
  url: string
  height?: number // in px
  lightTheme?: boolean
}

function Iframe() {
  const { url: initialURL } = useDevbook({ env: Env.Supabase, port: 3000 })

  const iframeRef = useRef<IframeElHandle>(null)
  const [url, setURL] = useState<string>()

  useEffect(function initializeURL() {
    setURL(initialURL)
  }, [initialURL])

  function handleReloadIframe() {
    iframeRef.current?.reload()
  }

  return (
    <div className="dark bg-black-650 h-full w-full">
      <Header
        url={initialURL}
        onConfirm={setURL}
        onReloadIframe={handleReloadIframe}
      />
      {url
        ? (
          <IframeEl
            ref={iframeRef}
            src={url}
          />
        )
        : (
          <div
            className="
            flex
            flex-1
            items-center
            justify-center
            bg-gray-800
            dark:bg-gray-700
          "
          >
            <SpinnerIcon />
          </div>
        )}
    </div>
  )
}

export default Iframe
