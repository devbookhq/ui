import {
  useEffect,
  useRef, useState,
} from 'react'
import { useDevbook, Env } from '@devbookhq/sdk'

import SpinnerIcon from '../../SpinnerIcon'

import Header from './Header'
import IframeEl, { IframeElHandle } from './IframeEl'

export interface Props {
  devbook: ReturnType<typeof useDevbook>
}

function Iframe({
  devbook: {
    url: initialURL,
  },
}: Props) {
  const iframeRef = useRef<IframeElHandle>(null)
  const [url, setURL] = useState<string>()


  console.log('iframe')
  useEffect(function initializeURL() {
    setURL(initialURL)
  }, [initialURL])

  function handleReloadIframe() {
    iframeRef.current?.reload()
  }

  return (
    <div className="dark bg-black-650 flex flex-1 flex-col">
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
          "
          >
            <SpinnerIcon />
          </div>
        )}
    </div>
  )
}

export default Iframe
