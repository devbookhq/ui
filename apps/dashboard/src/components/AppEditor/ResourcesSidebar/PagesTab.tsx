import clsx from 'clsx'
import { PlusCircle, Trash2 } from 'lucide-react'
import { observer } from 'mobx-react-lite'

import Input from 'components/Input'
import Text from 'components/typography/Text'

import { useRootStore } from 'core/EditorProvider/models/RootStoreProvider'

function PagesTab() {
  const { pages, selectPage, deletePage, createPage, selectedPage } = useRootStore()

  return (
    <div className="flex flex-1 flex-wrap space-y-2">
      <div className="flex flex-1 items-center justify-between">
        <Text
          text="Pages"
          className="text-slate-400"
        />
        <div
          className="cursor-pointer text-slate-300 hover:text-amber-400"
          onClick={createPage}
        >
          <PlusCircle size="16px" />
        </div>
      </div>
      {pages.map((p, i) => (
        <div
          key={i}
          className={clsx(
            'group flex flex-1 cursor-pointer flex-col space-y-2 rounded border px-2 py-3',
            {
              'border-amber-400': selectedPage === i,
              'border-slate-100 hover:border-slate-200': selectedPage !== i,
            },
          )}
          onClick={e => {
            e.stopPropagation()
            selectPage(i)
          }}
        >
          <div className="flex justify-between">
            <Text
              text={`Page ${i + 1}`}
              className="text-slate-400 group-hover:text-slate-600"
              size={Text.size.S3}
            ></Text>
            {i !== 0 && (
              <div
                className="cursor-pointer text-slate-300 hover:text-amber-800"
                onClick={e => {
                  e.stopPropagation()
                  deletePage(i)
                  if (selectedPage === i) {
                    selectPage(0)
                  }
                }}
              >
                <Trash2 size="14px" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col space-y-1">
            <Text
              className="mr-12 flex w-12 whitespace-nowrap text-slate-400"
              size={Text.size.S3}
              text="Name"
            />
            <Input
              value={p.name}
              onChange={e => p.setName(e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default observer(PagesTab)
