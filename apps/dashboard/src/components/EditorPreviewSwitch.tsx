import Link from 'next/link'
import { useRouter } from 'next/router'

import Button from './Button'

export interface Props {
  className?: string
}

function EditorPreviewSwitch({ className }: Props) {
  const router = useRouter()
  const isPreview = router.pathname === '/apps/[slug]/preview'
  const isEdit = router.pathname === '/apps/[slug]/edit'

  return (
    <>
      {isPreview && (
        <Link
          href={{
            pathname: '/apps/[slug]/edit',
            query: {
              slug: router.query.slug,
            },
          }}
        >
          <Button
            className={className}
            text="Back to editor"
          />
        </Link>
      )}
      {isEdit && (
        <Link
          href={{
            pathname: '/apps/[slug]/preview',
            query: {
              slug: router.query.slug,
            },
          }}
        >
          <Button
            className={className}
            text="Preview"
          />
        </Link>
      )}
    </>
  )
}

export default EditorPreviewSwitch
