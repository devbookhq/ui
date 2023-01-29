import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  LiHTMLAttributes,
} from 'react'

import Text from 'components/typography/Text'

type Props<T, U extends HTMLAttributes<T> = HTMLAttributes<T>> = DetailedHTMLProps<U, T>

export function h1(p: Props<HTMLHeadingElement>) {
  return <h1 className="text-gray-100">{p.children}</h1>
}

export function h2(p: Props<HTMLHeadingElement>) {
  return <h2 className="text-gray-100">{p.children}</h2>
}

export function h3(p: Props<HTMLHeadingElement>) {
  return <h3 className="text-gray-100">{p.children}</h3>
}

export function strong(p: Props<HTMLElement>) {
  return (
    <strong
      className="text-gray-100"
    >
      {p.children}
    </strong>
  )
}

export function a(p: Props<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a
      className="
        text-gray-100
        font-bold
        border-b
        border-green-500
        hover:border-b-[2px]
        no-underline
      "
      href={p.href}
      rel="noreferrer noopener"
      target="_blank"
    >
      {p.children}
    </a>
  )
}

export function li(p: Props<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>) {
  return (
    <li>
      <Text
        className="text-gray-500"
        icon={p.children}
        text=""
      />
    </li>
  )
}

export function p(p: Props<HTMLParagraphElement>) {
  return (
    <p className="
      text-gray-500
      text-base
      leading-7
    ">
      {p.children}
    </p>
  )
}

export function hr(p: Props<HTMLHRElement>) {
  return <hr className="border-gray-700" />
}

export function code(p: Props<HTMLElement>) {
  return (
    <code className="
      rounded
      mx-[2px]
      py-px
      px-1
      text-indigo-100
      text-sm
      font-medium
      bg-gray-700/40
      whitespace-nowrap
      before:content-['']
      after:content-['']
    ">
      {p.children}
    </code>
  )
}
