import { uiComponentsList } from '../UIComponent'

function Editor() {
  return (
    <div className="flex px-2 py-4 flex-col space-y-2">
      {uiComponentsList.map(ui => (
        <ui.Sidebar key={ui.id} />
      ))}
    </div>
  )
}

export default Editor
