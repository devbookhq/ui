import { useRouter } from 'next/router'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import { useSession, SharedSessionProvider } from '@devbookhq/react'
import Splitter, { SplitDirection, GutterTheme } from '@devbookhq/splitter'
import { Loader } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

import GuideFileEditor from 'components/GuideFileEditor'
import { OpenedFile } from 'components/GuideFileEditor/reducer'
import GuideStepInstructions from 'components/GuideStepInstructions'
import { CodeLayout, Guide } from 'guides/content/Guide'
import { getGuideEntry, supabaseAdmin } from 'queries/admin'
import { getGuideData } from 'guides/content'
import Text from 'components/typography/Text'

interface PathProps extends ParsedUrlQuery {
  site: string;
  slug: string;
}

export interface Props {
  guide: Guide
}

export default function GuidePage(p: Props) {
  const guide = p.guide
  const router = useRouter()

  const [initialOpenedFiles, setInitialOpenedFiles] = useState<OpenedFile[] | undefined>(undefined)
  const [splitterSizes, setSplitterSizes] = useState([0, 100])
  const [isSplitterDirty, setIsSplitterDirty] = useState(false) // True if user manually resized splitter.
  const sessionHandle = useSession({
    codeSnippetID: guide.environmentID,
    debug: process.env.NODE_ENV === 'development',
    inactivityTimeout: 0,
  })

  const stepIdx = router.query.step ? Number.parseInt(router.query.step as string) : 0
  // If stepIdx is in the range, load the step, otherwise load the last step
  const step = stepIdx <= guide.steps.length - 1 ? guide.steps[stepIdx] : guide.steps[guide.steps.length - 1]

  const previousStep = useCallback(() => {
    if (stepIdx <= 0) return

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        step: stepIdx - 1,
      },
    }, undefined, { shallow: true })
  }, [router, stepIdx])

  const nextStep = useCallback(() => {
    if (stepIdx >= guide.steps.length) return

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        step: stepIdx + 1,
      },
    }, undefined, { shallow: true })
  }, [
    stepIdx,
    router,
    guide.steps.length,
  ])

  const goToStep = useCallback((targetStepIdx: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        step: targetStepIdx,
      },
    }, undefined, { shallow: true })
  }, [router])

  const handleResizeFinished = useCallback((_: number, newSizes: number[]) => {
    setIsSplitterDirty(true)
    setSplitterSizes(newSizes)
  }, [])

  useEffect(function loadInitialOpenedFiles() {
    if ((!sessionHandle.session?.filesystem)) return
    if (
      (step.type !== 'Guide')
      || (step.layout?.type !== 'Code')
    ) {
      setInitialOpenedFiles([])
      if (!isSplitterDirty) {
        setSplitterSizes([0, 100])
      }
      return
    }

    const filePaths = (step.layout as CodeLayout).props?.tabs?.map(t => t.path) || []
    if (filePaths.length === 0) {
      setInitialOpenedFiles([])
      if (!isSplitterDirty) {
        setSplitterSizes([0, 100])
      }
      return
    }

    const promisedContents: Promise<string>[] = []
    const ofs: OpenedFile[] = []
    for (const fp of filePaths) {
      ofs.push({
        path: fp,
        content: '',
        canBeClosed: false,
      })
      promisedContents.push(sessionHandle.session.filesystem.read(fp))
    }

    Promise.all(promisedContents)
      .then(contents => {
        for (let i = 0; i < contents.length; i++) {
          ofs[i].content = contents[i]
        }
        setInitialOpenedFiles(ofs)
        // Open the file editor so it's visible to user
        if (!isSplitterDirty) {
          setSplitterSizes([40, 60])
        }
      })
  }, [
    sessionHandle.session,
    step,
    isSplitterDirty,
  ])

  if (!step) return (
    <div className="
      flex
      flex-1
    ">
      <Text
        className="m-auto flex"
        size={Text.size.S1}
        text="Step not found"
      />
    </div>
  )

  if (router.isFallback) return <Loader />

  return (
    <SharedSessionProvider session={sessionHandle}>
      <div className="
          flex
          flex-1
        ">
        {/* {step.type === 'Rating' &&
          <GuideRating
            guidePath={guidePath}
            onBackClick={previousStep}
          />
        } */}

        {step.type === 'Guide' && initialOpenedFiles !== undefined &&
          <Splitter
            classes={['flex', 'flex lg:min-w-[500px]']}
            direction={SplitDirection.Horizontal}
            draggerClassName="w-[2px] rounded-full bg-gray-500 group-hover:bg-gray-400"
            gutterClassName="group px-0.5 transition-all bg-gray-900 border-x border-gray-800 hover:bg-gray-800 z-40"
            gutterTheme={GutterTheme.Dark}
            initialSizes={splitterSizes}
            onResizeFinished={handleResizeFinished}
          >
            <GuideFileEditor
              initialOpenedFiles={initialOpenedFiles}
            />
            <GuideStepInstructions
              canGoBack={stepIdx > 0}
              canGoNext={stepIdx < guide.steps.length - 1}
              stepIdx={stepIdx}
              steps={guide.steps}
              onBackClick={previousStep}
              onGoToStepClick={goToStep}
              onNextClick={nextStep}
            />
          </Splitter>
        }
      </div>
    </SharedSessionProvider>
  )
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error('No path parameters found')

  const { site, slug } = params

  try {
    const guideEntry = await getGuideEntry(supabaseAdmin, site, slug)
    const guide = await getGuideData(guideEntry)

    return {
      props: {
        guide,
        guideEntry,
      },
    }

  } catch (err) {
    console.error(err)
    return { notFound: true, revalidate: 10 }
  }
}
