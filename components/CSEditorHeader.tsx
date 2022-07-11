import { useEffect, useState } from 'react'

import {
  PublishedCodeSnippet,
} from 'types'
import TitleLink from 'components/TitleLink'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import SpinnerIcon from 'components/icons/Spinner'

interface Props {
  slug: string
  onPublishClick: (e: any) => void
  isPublishing: boolean
  isLoadingPublishedCS: boolean
  publishedCS?: PublishedCodeSnippet
}

function CSEditorHeader({
  slug,
  onPublishClick,
  isPublishing,
  isLoadingPublishedCS,
  publishedCS,
}: Props) {
  const [publishedURL, setPublishedURL] = useState<{ address: string, protocol: string }>()

  useEffect(function getPublishedURL() {
    if (typeof window === 'undefined') return
    if (!publishedCS) return

    const address = `${window.location.host}${!!window.location.port ? ':' + window.location.port : ''}/${slug}`
    const protocol = window.location.protocol
    setPublishedURL({ address, protocol })
  }, [slug, publishedCS])

  return (
    <div className="
      flex
      items-center
      justify-between
    ">
      <div className="
        flex
        items-center
        space-x-2
        min-h-[48px]
      ">
        <TitleLink
          href={{
            pathname: '/',
          }}
          title="Code Snippets"
        />
        <Title title="/" />
        <Title title="Edit" />
      </div>

      <div className="
        flex
        items-center
        justify-between
        space-x-4
      ">
        {isLoadingPublishedCS
          ? (
            <SpinnerIcon />
          )
          : (publishedURL
            ? (
              <a
                rel="noreferrer"
                target="_blank"
                href={`${publishedURL.protocol}//${publishedURL.address}`}
                className="
                max-w-full
                text-green-500
                overflow-hidden
                truncate
                text-sm
                cursor-pointer
                underline
              "
              >
                {publishedURL.address}
              </a>
            )
            : (
              <Title
                title="Not published yet"
                size={Title.size.T3}
                rank={Title.rank.Secondary}
              />
            )
          )}
        <Button
          icon={isPublishing && <SpinnerIcon />}
          text={isPublishing ? 'Publishing...' : 'Publish'}
          onClick={onPublishClick}
        />
      </div>
    </div>
  )
}

export default CSEditorHeader
