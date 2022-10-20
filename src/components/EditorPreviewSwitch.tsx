import { useRouter } from 'next/router'

import Button from './Button'

export interface Props {
  className?: string
}

function EditorPreviewSwitch({ className }: Props) {
  const router = useRouter()
  const isPreview = router.pathname === '/[slug]/preview'
  const isEdit = router.pathname === '/[slug]/edit'

  return (
    <>
      {isPreview && (
        <div>
          <Button
            className={className}
            text="Edit"
            onClick={() =>
              router.push({
                pathname: '/[slug]/edit',
                query: {
                  slug: router.query.slug,
                },
              })
            }
          />
        </div>
      )}
      {isEdit && (
        <Button
          className={className}
          text="Preview"
          onClick={() =>
            router.push({
              pathname: '/[slug]/preview',
              query: {
                slug: router.query.slug,
              },
            })
          }
        />
      )}
    </>
  )
}

export default EditorPreviewSwitch
