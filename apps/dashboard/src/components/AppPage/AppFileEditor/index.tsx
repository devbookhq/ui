import { basename } from 'path-browserify'
import { useSharedSession } from '@devbookhq/react'
import dynamic from 'next/dynamic'

// import { NodeType } from 'utils/filesystem'
import {
  memo,
  useCallback,
  useEffect,
  useReducer,
} from 'react'
import FileButton from './FileButton'
// import useFiletree, { Node } from 'utils/useFiletree'

const CodeEditor = dynamic(() =>
  import('../Editor')
)

import {
  OpenedFile,
  init,
  reducer,
} from './reducer'

export interface Props {
  initialOpenedFiles: OpenedFile[]
}

function AppFileEditor({ initialOpenedFiles }: Props) {
  const { session } = useSharedSession()
  // const filetree = useFiletree()
  const [state, dispatch] = useReducer(reducer, initialOpenedFiles, init)

  const writeFile = useCallback((content: string) => {
    if (state.openedFiles.length === 0) return

    const { path } = state.openedFiles[state.selectedIdx]
    session?.filesystem?.write(path, content)
  }, [
    session,
    state,
  ])

  const handleFileButtonClick = useCallback(async (idx: number) => {
    if (!session?.filesystem) return
    // We need to load the latest content in the filesystem when switching to different files.
    // This could be improved by handling it in an optimistic way and keeping the latest content just on the frontend.

    const content = await session?.filesystem?.read(state.openedFiles[idx].path)
    dispatch({
      type: 'SelectFile',
      payload: {
        idx,
        content,
      },
    })
  }, [session?.filesystem, state.openedFiles])


  // useEffect(function listenOnFiletreeSelect() {
  //   async function openFile(n: Node) {
  //     if (!session?.filesystem) return
  //     if (n.type === NodeType.Dir) return

  //     const content = await session.filesystem.read(n.path)
  //     dispatch({
  //       type: 'OpenFile',
  //       payload: {
  //         path: n.path,
  //         content,
  //         canBeClosed: true,
  //       },
  //     })
  //   }

  //   filetree.addSelectListener(openFile)
  //   return () => filetree.removeSelectListener(openFile)
  // }, [filetree, session])

  useEffect(() => {
    dispatch({
      type: 'SetOpenedFiles',
      payload: { openedFiles: initialOpenedFiles },
    })
  }, [initialOpenedFiles])

  return (
    <>
      {state.openedFiles.length !== 0 &&
        <div className="
      flex
      flex-1
      flex-col
      max-w-full
    ">
          <div className="
        flex
        pt-1
        px-4
        pb-0
        border-b
        border-gray-300
      ">
            {state.openedFiles.map((of, idx) => (
              <FileButton
                displayCloseButton={of.canBeClosed && state.openedFiles.length > 1}
                isFirst={idx === 0}
                isLast={idx === state.openedFiles.length - 1}
                isSelected={state.selectedIdx === idx}
                key={of.path}
                text={basename(of.path)}
                onClick={() => handleFileButtonClick(idx)}
                onCloseClick={() => dispatch({
                  type: 'CloseFile',
                  payload: { idx },
                })}
              />
            ))}
          </div>
          <div className="
              relative
              flex-1
              overflow-hidden
            ">
            <CodeEditor
              className="p-1 pt-0 absolute inset-0"
              content={state.openedFiles[state.selectedIdx].content}
              filename={state.openedFiles[state.selectedIdx].path}
              onContentChange={writeFile}
              autofocus
            />
          </div>
        </div>
      }
    </>
  )
}

export default memo(AppFileEditor)
