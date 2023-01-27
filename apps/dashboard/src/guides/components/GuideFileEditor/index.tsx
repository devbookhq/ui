import { CodeEditor } from '@devbookhq/code-editor'
import { basename } from 'path-browserify'
import { useSharedSession } from '@devbookhq/react'

// import { NodeType } from 'utils/filesystem'
import {
  memo,
  useCallback,
  useEffect,
  useReducer,
} from 'react'
import FileButton from '../FileButton'
// import useFiletree, { Node } from 'utils/useFiletree'

import {
  OpenedFile,
  init,
  reducer,
} from './reducer'
import { supportedLanguages } from 'guides/languages'
// import {
//   analytics,
//   editFileDebounce,
// } from 'utils/analytics'

export interface Props {
  initialOpenedFiles: OpenedFile[]
}

function GuideFileEditor({ initialOpenedFiles }: Props) {
  const { session } = useSharedSession()
  // const filetree = useFiletree()
  const [state, dispatch] = useReducer(reducer, initialOpenedFiles, init)

  // const contentChangeAnalytics = useMemo(() => debounce((code: string, filename: string) => {
  //   analytics.track('guide file edited', {
  //     code,
  //     filename,
  //   })
  // }, editFileDebounce, {
  //   leading: false,
  //   trailing: true,
  // }), [])

  const writeFile = useCallback((content: string) => {
    if (state.openedFiles.length === 0) return

    const { path } = state.openedFiles[state.selectedIdx]
    session?.filesystem?.write(path, content)

    // contentChangeAnalytics(content, path)
  }, [
    session,
    state,
    // contentChangeAnalytics,
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

  const handleEditorCopy = useCallback((code: string, startLine: number) => {
    // analytics.track('guide editor selection copied', {
    //   code,
    //   startLine,
    // })
  }, [])

  if (state.openedFiles.length === 0) return null
  return (
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
          onCopy={handleEditorCopy}
          supportedLanguages={supportedLanguages}
          autofocus
        />
      </div>
    </div>
  )
}

export default memo(GuideFileEditor)
