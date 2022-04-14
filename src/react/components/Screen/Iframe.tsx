import type { useDevbook } from '@devbookhq/sdk'
import {
  memo,
  useEffect,
  useRef, useState,
} from 'react'

import Header from '../Iframe/Header'
import Separator from '../Separator'
import SpinnerIcon from '../SpinnerIcon'
import Text from '../Text'
import IframeEl, {
  IframeElHandle,
} from './IframeEl'

export interface Props {
  url?: string
  height?: string
  lightTheme?: boolean
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
}

function Iframe({
  url: initURL,
  height,
  lightTheme,
  devbook: {
    fs,
    status,
  },
}: Props) {
  const iframeRef = useRef<IframeElHandle>(null)
  const [url, setURL] = useState<string>()
  const [initialURL, setInitialURL] = useState<string | undefined>(initURL)

  useEffect(function initializeURL() {
    setURL(initialURL)
  }, [initialURL])

  function handleReloadIframe() {
    iframeRef.current?.reload()
  }

  useEffect(function getURL() {
    async function init() {

      let handle: any

      const clear = () => {
        clearInterval(handle)
      }

      handle = setInterval(async () => {
        try {
          if (!fs) return
          if (status !== 'Connected') return
          if (url) return
          const logs = await fs.get('/quickstart/ngrok.log')
          if (!logs) return
          const addresses = logs.split('\n').filter(l => l.includes('.ngrok.io'))
          if (addresses.length === 0) return
          const addressArray = addresses[0].split('url=http')
          const address = addressArray.length === 2 ? 'https' + addressArray[1] : undefined
          if (!address) return

          setURL(address)
          setInitialURL(address)
          clear()
        } catch (err: any) {
          console.error(err)
        }
      }, 20000)

      return clear
    }
    const cleanup = init()

    return () => {
      cleanup.then(c => {
        c?.()
      })
    }
  }, [fs, url, status])

  return (
    <div className={`flex h-full flex-col flex-1 ${lightTheme ? '' : 'dark'}`}>
      <Header
        rounded={false}
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
            bg-black-700
          "
          >
            <Text
              text="No URL"
              hierarchy={Text.hierarchy.Secondary}
            />
          </div>
        )}
    </div>
  )
}

export default memo(Iframe)
