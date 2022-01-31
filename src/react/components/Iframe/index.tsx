import {
  useEffect,
  useRef, useState,
} from 'react'

import Separator from '../Separator'
import SpinnerIcon from '../SpinnerIcon'

import Header from './Header'
import IframeEl, { IframeElHandle } from './IframeEl'

export interface Props {
  url: string
  height?: number // in px
  lightTheme?: boolean
}

function Iframe({
  url: initialURL,
  height = 150,
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
    <div className={`${lightTheme ? '' : 'dark'}`}>
      <Header
        url={initialURL}
        onConfirm={setURL}
        onReloadIframe={handleReloadIframe}
      />
      <Separator
        variant={Separator.variant.CodeEditor}
        dir={Separator.dir.Horizontal}
      />
      {url
        ? (
          <IframeEl
            height={height}
            ref={iframeRef}
            src={url}
          />
        )
        : (
          <div
            style={{
              height: `${height}px`,
            }}
            className="
            flex
            items-center
            justify-center
            rounded-b
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
