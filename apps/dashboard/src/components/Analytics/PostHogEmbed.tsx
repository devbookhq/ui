import { useEffect, useState } from 'react'

export interface Props {
  url?: string
  name?: string
}

function PostHogEmbed({ url, name }: Props) {
  const [height, setHeight] = useState(400)

  useEffect(() => {
    if (!name) return

    const onChange = (e: any) => {
      if (e.data.event === 'posthog:dimensions' && e.data.name === name) {
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', onChange)
    return () => window.removeEventListener('message', onChange)
  }, [name])


  if (!url) return null

  return (
    <div>
      <iframe
        name={name}
        width="100%"
        height={height}
        src={url}
      ></iframe>
    </div>
  )
}

export default PostHogEmbed
