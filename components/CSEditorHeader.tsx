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
            pathname: '/dashboard',
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
          : (publishedCS
            ? (
              <a
                href={`http://localhost:3000/${slug}`}
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
                {`localhost:3000/${slug}`}
                {/*{`localhost:3000/${encodeURIComponent(codeSnippet.title)}-${codeSnippet.id}`}*/}
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
