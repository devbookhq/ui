import {
  useMemo,
  ReactNode,
} from 'react'
import {
  chromeLight,
  ObjectInspector,
  TableInspector,
  ObjectLabel,
  ObjectRootLabel,
} from 'react-inspector'

import { useAppContext } from '../AppContext'
import Text from 'components/typography/Text'
import { LoaderIcon } from 'lucide-react'


function extractJSON(str: string, startDelimiter: '{' | '[', endDelimiter: '}' | ']'): [any, number, number] | undefined {
  let firstOpen: number = 0, firstClose: number, candidate: string
  firstOpen = str.indexOf(startDelimiter, firstOpen)
  do {
    firstClose = str.lastIndexOf(endDelimiter)
    // console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose)
    if (firstClose <= firstOpen) {
      return undefined
    }
    do {
      candidate = str.substring(firstOpen, firstClose + 1)
      // console.log('candidate: ' + candidate)
      try {
        var res = JSON.parse(candidate)
        // console.log('...found')
        return [res, firstOpen, firstClose + 1]
      }
      catch (e) {
        // console.log('...failed')
      }
      firstClose = str.substring(0, firstClose).lastIndexOf(endDelimiter)
    } while (firstClose > firstOpen)
    firstOpen = str.indexOf(startDelimiter, firstOpen + 1)
  } while (firstOpen != -1)
}

function extract(o: any, pathSegments: string[]) {
  return pathSegments.reduce((prev, curr) => {
    if (prev === undefined) return prev
    if (curr in prev) {
      return prev[curr]
    }
    return undefined
  }, o)
}

export interface Props {
  type: 'json' | 'line' | 'value' | 'array'
  position?: number
  children?: ReactNode
  noContentLabel?: string
  expandPaths?: string | string[]
  extractPath?: string[]
  highlightField?: string
}

function Output({
  type,
  position = 1,
  children,
  noContentLabel,
  expandPaths,
  highlightField,
  extractPath,
}: Props) {
  const [appCtx] = useAppContext()

  const content = useMemo(() => {
    if (!appCtx.Code.output) return

    if (type === 'json' || type === 'value' || type === 'array') {
      let blob = appCtx.Code.output.join('')

      for (let i = 1; i <= position; i++) {

        console.log(blob)
        const parsed = extractJSON(blob, type === 'array' ? '[' : '{', type === 'array' ? ']' : '}')
        if (!parsed) return

        console.log(parsed[0])
        if (i === position) {
          return parsed[0]
        } else {
          blob = blob.slice(parsed[2])
        }
      }
    } else if (type === 'line') {
      if (appCtx.Code.output.length >= position) {
        return appCtx.Code.output[position - 1]
      }
    }

  }, [appCtx.Code.output, type, position])
  const extractedContent = content && extractPath ? extract(content, extractPath) : content

  const renderer = useMemo(() => {
    const r = ({ depth, name, data, isNonenumerable, expanded }: any) => {
      if (!highlightField || highlightField !== name) {
        return depth === 0
          ? <ObjectRootLabel name={name} data={data} />
          : <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />
      } else {
        return depth === 0
          ? <ObjectRootLabel name={name} data={data} />
          : <div className="border-brand-300 border bg-white shadow-lg inline-flex px-1 rounded py-0.5 -ml-1">
            <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />
          </div>
      }
    }
    r.displayName = 'Renderer'

    return r
  }, [highlightField])

  const isLoading = appCtx.Code.isRunning

  return (
    <div className="
    flex
    flex-col
    flex-1
    space-y-1
    mt-1
    mb-2
    ">

      {children &&
        <div className="
          space-x-2
          items-center
          flex
          flex-row
          prose-p:my-0
          "
        >
          {isLoading &&
            <LoaderIcon
              className="
                  text-gray-500
                  animate-spin
                "
              size={14}
            />
          }
          {children}
        </div>
      }
      <div className="
      border
      border-slate-300
      rounded
      px-4
      flex
      flex-col
      flex-1
      py-2
      space-y-2
    ">
        {noContentLabel && extractedContent === undefined &&
          <Text
            text={noContentLabel}
            size={Text.size.S3}
            className="
            text-slate-400
            italic
            "
          />
        }
        {extractedContent !== undefined && type === 'array' &&
          <>
            {content.length === 0 &&
              <div className="whitespace-pre text-xs font-bold">
                No items found
              </div>
            }
            {content.length > 0 &&
              <TableInspector
                data={content}
                theme={{
                  ...chromeLight, ...({
                    BASE_BACKGROUND_COLOR: 'transparent',
                    TABLE_BORDER_COLOR: 'transparent',
                    TABLE_TH_BACKGROUND_COLOR: 'transparent',
                    TABLE_TH_HOVER_COLOR: 'transparent',
                    TABLE_SORT_ICON_COLOR: 'black',
                    TABLE_DATA_BACKGROUND_IMAGE: 'transparent',
                    TABLE_DATA_BACKGROUND_SIZE: '128px 64px',
                  })
                } as any}
              />
            }
          </>
        }
        {extractedContent !== undefined && type === 'json' &&
          <ObjectInspector
            data={content}
            expandPaths={expandPaths}
            nodeRenderer={renderer}
            theme={{
              ...chromeLight, ...({
                TREENODE_PADDING_LEFT: 20,
                BASE_BACKGROUND_COLOR: 'transparent',
              })
            } as any}
          />
        }
        {extractedContent !== undefined && (type === 'line' || type === 'value') &&
          <div className="font-mono whitespace-pre">
            {extractedContent}
          </div>
        }
      </div>
    </div>
  )
}

export default Output
