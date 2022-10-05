import {
  withPageAuth,
} from '@supabase/supabase-auth-helpers/nextjs'

import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx) {
    return {
      props: {}
    }
  }
})

interface Props {

}

function DropTarget() {
  const [collectedProps, drop] = useDrop(() => ({
    accept: 'test',
  }))

  return <div ref={drop}>Drop Target</div>
}


function DraggableComponent() {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: 'test',
    item: { id: 1 },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return collected.isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <div ref={drag} {...collected}>
      ITEM
    </div>
  )
}



function AppEditor({ }: Props) {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <DraggableComponent></DraggableComponent>
        <DropTarget></DropTarget>
        {/* EDITOR */}
      </DndProvider>
    </div>
  )
}

export default AppEditor
