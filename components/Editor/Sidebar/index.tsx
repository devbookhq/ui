import { uiComponentsList } from '../UIComponent'

function Editor() {
  return (
    <div className="flex flex-col space-y-2 px-2 py-4">
      {uiComponentsList.map(ui => (
        <ui.Sidebar key={ui.id} />
      ))}
    </div>
  )
}

export default Editor
