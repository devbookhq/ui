import Splitter, { SplitDirection } from '@devbookhq/splitter'
import React, {
  ReactNode,

} from 'react'



export interface Props {
  children: ReactNode
  isResizable?: boolean
}

const Half = (props: any) => <div {...props} style={{
  width: '50%',
  img: {
    height: 'auto',
  }
}} />

function Horizontal({
  isResizable,
  children,
}: Props) {
  const [first, ...rest] = React.Children.toArray(children)
  const c = [<Half key='first'>{first}</Half>, <Half key='rest'>{rest}</Half>]

  return (
    <div
      className="flex flex-1 items-start"
    >
      {c}
      {/* <Splitter
      
        classes={['flex', 'flex lg:min-w-[500px]']}
        direction={SplitDirection.Horizontal}
        draggerClassName="w-[2px] rounded-full bg-gray-500 group-hover:bg-gray-400"
        gutterClassName="group px-0.5 transition-all bg-gray-900 border-x border-gray-800 hover:bg-gray-800 z-40"
        gutterTheme={GutterTheme.Dark}
        initialSizes={splitterSizes}
        onResizeFinished={handleResizeFinished}
      >
        <AppFileEditor
          initialOpenedFiles={initialOpenedFiles}
        />
        <AppContentView
          content={content}
        />
      </Splitter> */}
    </ div>
  )
}

export default Horizontal
