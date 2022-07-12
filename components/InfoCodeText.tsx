import cn from 'classnames'
import CopyIcon from './icons/Copy'

import Text from './typography/Text'

function InfoCodeText({ text, clipboard, label }: { text: string, clipboard?: boolean, label?: string }) {
  function copy() {
    if (clipboard && text) {
      const clipboardText = text.replace('<dependency>', '')
      navigator.clipboard.writeText(clipboardText)
    }
  }

  return (
    <div
      className={cn('text-gray-800 bg-black-800 border border-black-700 py-[1px] px-2 rounded items-center flex-row inline-flex', { 'hover:cursor-pointer hover:bg-black-700 space-x-2': clipboard })}
      onClick={copy}
    >
      <Text
        className="text-gray-500"
        text={label || text}
        mono={true}
      />
      {clipboard && <CopyIcon />}
    </div>
  )
}

export default InfoCodeText
