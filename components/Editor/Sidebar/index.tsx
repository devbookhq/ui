import { uiComponentsList } from '../UIComponent'

function Editor() {
  return (
    <div className="flex flex-1">
      {uiComponentsList.map(ui => <ui.Sidebar key={ui.id} />)}
    </div>
  )
}

export default Editor
