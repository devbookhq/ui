import { useMemo, ReactNode } from 'react'
import { chromeLight, ObjectInspector, } from 'react-inspector'

import { useAppContext } from '../AppContext'
import Text from 'components/typography/Text'
import { LoaderIcon } from 'lucide-react'

function extractJSON(str: string): [any, number, number] | undefined {
  let firstOpen: number = 0, firstClose: number, candidate: string
  firstOpen = str.indexOf('{', firstOpen)
  do {
    firstClose = str.lastIndexOf('}')
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
      firstClose = str.substring(0, firstClose).lastIndexOf('}')
    } while (firstClose > firstOpen)
    firstOpen = str.indexOf('{', firstOpen + 1)
  } while (firstOpen != -1)
}

function extract(o: any, pathSegments: string[]) {
  return pathSegments.reduce((prev, curr) => {
    console.log(prev, curr)
    if (prev === undefined) return prev
    if (curr in prev) {
      return prev[curr]
    }
    return undefined
  }, o)
}

export interface Props {
  type: 'json' | 'line' | 'value'
  position?: number
  children?: ReactNode
  noContentLabel?: string
  expandPaths?: string | string[]
  extractPath?: string[]
}

function Output({
  type,
  position = 1,
  children,
  noContentLabel,
  expandPaths,
  extractPath,
}: Props) {
  const [appCtx] = useAppContext()

  const content = useMemo(() => {
    if (!appCtx.Code.output) return

    if (type === 'json' || type === 'value') {
      let blob = appCtx.Code.output.join('')
      for (let i = 1; i <= position; i++) {
        const parsed = extractJSON(blob)
        if (!parsed) return

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

  console.log('c', extractedContent)
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
        {extractedContent !== undefined && type === 'json' &&
          <ObjectInspector
            data={content}
            expandPaths={expandPaths}
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
