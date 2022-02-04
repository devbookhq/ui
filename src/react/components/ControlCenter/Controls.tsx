import { useState } from 'react'
import FileEditor from './FileEditor'
import Iframe from './Iframe'

enum Tab {
  Iframe,
  Editor,
}

function Controls() {
  const [tab, setTab] = useState(Tab.Editor)

  return (
    <>
      {tab === Tab.Editor &&
        <FileEditor />
      }
      {tab === Tab.Iframe &&
        <Iframe />
      }
    </>
  )
}

export default Controls
