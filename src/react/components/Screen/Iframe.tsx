import {
  useEffect,
  useRef, useState,
} from 'react'

import Header from '../Iframe/Header'
import Separator from '../Separator'
import SpinnerIcon from '../SpinnerIcon'
import IframeEl, {
  IframeElHandle,
} from './IframeEl'

export interface Props {
  url: string
  height?: string
  lightTheme?: boolean
}

function Iframe({
  url: initialURL,
  height,
  lightTheme,
}: Props) {
  const iframeRef = useRef<IframeElHandle>(null)
  const [url, setURL] = useState<string>()

  useEffect(function initializeURL() {
    setURL(initialURL)
  }, [initialURL])

  function handleReloadIframe() {
    iframeRef.current?.reload()
  }

  return (
    <div className={`flex h-full flex-col flex-1 ${lightTheme ? '' : 'dark'}`}>
      <Header
        url={initialURL}
        onConfirm={setURL}
        onReloadIframe={handleReloadIframe}
      />
      {url
        ? (
          <IframeEl
            height="100%"
            ref={iframeRef}
            src={url}
          />
        )
        : (
          <div
            className="
            flex
            h-full
            items-center
            justify-center
            border-x
            border-b
            border-gray-500
            dark:border-black-600
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
