import Link from 'next/link'

interface Props {
  href: string
  title: string
}

function MyLink({ href, title }: Props) {
  return (
    <Link
      href={href}
    >
      <a className="
        font-medium
        text-black-600
        hover:no-underline
        hover:text-white-900
      ">
        {title}
      </a>
    </Link>
  )
}

export default MyLink

