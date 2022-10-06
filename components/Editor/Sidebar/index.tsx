import { dropTargetType } from '../Board'
import { asUIComponent } from './asUIComponent'
import UIPlaceholder from './UIComponents/Placeholder'

const availableComponents = [
  UIPlaceholder,
]

const uiComponents = availableComponents
  .map(c => asUIComponent(c, dropTargetType))

function Editor() {
  return (
    <div>
      {uiComponents.map(UIComp => <UIComp key={UIComp.displayName} />)}
    </div>
  )
}

export default Editor
