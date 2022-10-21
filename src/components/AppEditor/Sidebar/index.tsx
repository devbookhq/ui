import { observer } from 'mobx-react-lite'

import Blocks from './Blocks'

function Sidebar() {
  return (
    <div className="min-w-[250px] flex-col items-center space-y-4 border-l border-slate-200 py-4">
      <Blocks />
    </div>
  )
}

export default observer(Sidebar)
