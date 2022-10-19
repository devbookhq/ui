import { useRouter } from 'next/router'

import Button from './Button'

export interface Props {
  className?: string
}

function SwitchMode({ className }: Props) {
  const router = useRouter()
  const isPreview = router.pathname === '/[slug]'
  const isEdit = router.pathname === '/[slug]/edit'

  return (
    <>
      {isPreview && (
        <div>
          <Button
            className={className}
            text="Edit App"
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
          text="Open App"
          onClick={() =>
            router.push({
              pathname: '/[slug]',
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

export default SwitchMode
