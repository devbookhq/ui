import {
  useRef,
} from 'react'

import Separator from '../Separator'
import SpinnerIcon from '../SpinnerIcon'

import Header from './Header'
import IframeEl, { IframeElHandle } from './IframeEl'

export interface Props {
  url?: string
}

function Iframe({
  url,
}: Props) {
  const iframeRef = useRef<IframeElHandle>(null)

  function handleReloadIframe() {
    iframeRef.current?.reload()
  }

  return (
    <div>
      <Header
        url={url}
        onReloadIframe={handleReloadIframe}
      />
      <Separator
        variant={Separator.variant.CodeEditor}
        dir={Separator.dir.Horizontal}
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
            h-[150px]

            flex
            items-center
            justify-center

            rounded-b

            border-x
            border-b

            border-black-600

          bg-gray-700
          "
          >
            <SpinnerIcon />
          </div>
        )}
    </div>
  )
}

export default Iframe
