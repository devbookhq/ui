import { useEffect, useState } from 'react'
import FileEditor from './FileEditor'
import Iframe from './Iframe'
import ControlTab from './ControlTab'
import { useDevbook, Env, DevbookStatus } from '@devbookhq/sdk'
import SpinnerIcon from '../SpinnerIcon'

enum Tab {
  Iframe,
  Editor,
  Console,
}

export interface Props {
  env: Env
}

export const centerControls: { openFile?: (path: string) => void } = {
  openFile: undefined
}

function Controls({ env }: Props) {
  const [tab, setTab] = useState(Tab.Editor)
  const devbook = useDevbook({ debug: true, env, port: 3000 })
  const { status } = devbook

  const [filepath, setFilepath] = useState('/package.json')

  useEffect(function initControls() {
    centerControls.openFile = (path) => {
      setFilepath(path)
      setTab(Tab.Editor)
    }
    return () => {
      centerControls.openFile = undefined
    }
  }, [])

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
            {/* <ControlTab
              label="Console"
              isSelected={tab === Tab.Console}
              handleClick={() => setTab(Tab.Console)}
            /> */}
          </div>
          <div className="overflow-y-auto flex flex-1">
            {tab === Tab.Editor &&
              <FileEditor
                devbook={devbook}
                onFilepathChange={setFilepath}
                filepath={filepath}
              />
            }
            {tab === Tab.Iframe &&
              <Iframe devbook={devbook} />
            }
            {/* {tab === Tab.Console &&
              <Console devbook={devbook} />
            } */}
          </div>
        </>
      }
    </div>
  )
}

export default Controls
