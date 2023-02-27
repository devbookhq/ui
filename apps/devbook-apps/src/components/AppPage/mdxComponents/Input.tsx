import { ReactNode, useState } from 'react'
import { useAppContext } from '../AppContext'

import {
  code as C,
} from './base'

export interface Props {
  children: ReactNode
  line?: number
}

function Input({
  children,
  line,
}: Props) {
  const [appCtx, setAppCtx] = useAppContext()
  const [content, setContent] = useState(children?.toString() as string)

  const [target, setTarget] = useState<'FR' | 'US' | 'CA'>('US')




  function changeCode(geotarget: 'US' | 'FR' | 'CA') {
    // TODO: Make this hardcoded replacement general
    appCtx.Code.stop?.()

    setTarget(geotarget)

    setContent(c =>
      c
        .replace('yourUsername-country-US', `yourUsername-country-${geotarget}`)
        .replace('yourUsername-country-FR', `yourUsername-country-${geotarget}`)
        .replace('yourUsername-country-CA', `yourUsername-country-${geotarget}`)
    )

    appCtx.Code.changeContent?.(code =>
      code
        .replace('\'yourUsername-country-US\'', `\'yourUsername-country-${geotarget}\'`)
        .replace('\'yourUsername-country-FR\'', `\'yourUsername-country-${geotarget}\'`)
        .replace('\'yourUsername-country-CA\'', `\'yourUsername-country-${geotarget}\'`)
    )

    if (line !== undefined) {
      Object.values(appCtx.Explanation).forEach(e => {
        if (!e?.enabled) {
          e?.lineClickHandler?.(line)
        }
      })
    }

    appCtx.Code.run?.()
  }

  return (
    <div className="
    group
    inline-flex
    cursor-pointer
    ">
      <div
        // TODO: Check why is this happening - the MDX should not be rendered on server
        suppressHydrationWarning={true}
        onClick={() => {
          switch (target) {
            case 'FR':
              changeCode('US')
              break
            case 'US':
              changeCode('CA')
              break
            case 'CA':
              changeCode('FR')
              break
          }
        }}
        className="
        border-green-500
        inline-flex
        pb-[2px]
        group-hover:border-green-600
        border-b-4
      "
      >
        <C>
          {content}
        </C>
      </div>
    </div>
  )
}

export default Input
