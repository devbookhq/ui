import {
  useEffect,
  useState,
  useRef,
} from 'react'

import Separator from 'src/components/Separator'
import VerticalResizer from 'src/components/VerticalResizer'
import SpinnerIcon from 'src/components/icons/SpinnerIcon'

import Header from './Header'
import IframeEl, { IframeElHandle } from './IframeEl'

export interface Props {
  url: string
}

function Iframe({
  url,
}: Props) {
  const iframeRef = useRef<IframeElHandle>(null)
  const [isResizing, setIsResizing] = useState(false)

  /**
   * Tries to partition the env URL into the separate port, envID, and pathname components.
   *
   * It expects the env URL in the following format:
   * https://<port>-<envID>-<sessionID>.o.usedevbook.com/some/path
   */
  function partitionEnvURL(envURL: string) {
    // The running env URL has a following format:
    // https://<port>-<envID>-<sessionID>.o.usedevbook.com/some/path
    // We want the replace the "<sessionID>" parth with the current sessionID.

    const { host, pathname } = new URL(envURL)
    const [port, envID] = host // '<port>-<envID>-<sessionID>.o.usedevbook.com'
      .split('o.usedevbook.com')[0] // '<port>-<envID>-<sessionID>'
      .split('-') // ['<port>', '<envID>', '<sessionID>']

    // Env ID is in the format '<documentID>_<documentEnvID>'
    const [docID, docEnvID] = envID.split('_')

    return { port, envID, pathname, docID, docEnvID }
  }

  function toggleIsResizing() {
    setIsResizing(val => !val)
  }

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
      {canRenderIframe
        ? (
          <VerticalResizer
            onResizeStarted={toggleIsResizing}
            onResizeFinished={toggleIsResizing}
          >
            <IframeEl
              ref={iframeRef}
              src={url}
              hasPointerEvents={!isResizing}
            />
          </VerticalResizer>
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
