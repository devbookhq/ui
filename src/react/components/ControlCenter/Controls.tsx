import { useState } from 'react'
import FileEditor from './FileEditor'
import Iframe from './Iframe'
import ControlTab from './ControlTab'
import { useDevbook, Env, DevbookStatus } from '@devbookhq/sdk'
import SpinnerIcon from '../SpinnerIcon'

enum Tab {
  Iframe,
  Editor,
}

export interface Props {
  env: Env
}

function Controls({ env }: Props) {
  const [tab, setTab] = useState(Tab.Editor)
  const devbook = useDevbook({ debug: true, env, port: 3000 })
  const { status } = devbook

  return (
    <div className="flex flex-col flex-1 h-full w-full dark">
      {status !== DevbookStatus.Connected &&
        <div className="
          flex
          flex-1
          pt-4
          items-center
          justify-center
        ">
          <SpinnerIcon />
        </div>
      }
      {status === DevbookStatus.Connected &&
        <>
          <div className="flex">
            <ControlTab
              label="Editor"
              isSelected={tab === Tab.Editor}
              handleClick={() => setTab(Tab.Editor)}
            />
            <ControlTab
              label="Iframe"
              isSelected={tab === Tab.Iframe}
              handleClick={() => setTab(Tab.Iframe)}
            />
          </div>
          <div className="overflow-y-auto flex flex-1">
            {tab === Tab.Editor &&
              <FileEditor devbook={devbook} />
            }
            {tab === Tab.Iframe &&
              <Iframe devbook={devbook} />
            }
          </div>
        </>
      }
    </div>
  )
}

export default Controls
