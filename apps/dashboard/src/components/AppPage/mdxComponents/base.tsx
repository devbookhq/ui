import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  LiHTMLAttributes,
} from 'react'

import Text from 'components/typography/Text'

type Props<T, U extends HTMLAttributes<T> = HTMLAttributes<T>> = DetailedHTMLProps<U, T>

export function h1(p: Props<HTMLHeadingElement>) {
  return <h1 className="text-slate-800 font-bold text-4xl py-4 font-inter">{p.children}</h1>
}

export function h2(p: Props<HTMLHeadingElement>) {
  return <h2 className="text-2xl font-inter font-bold text-slate-800">{p.children}</h2>
}

export function h3(p: Props<HTMLHeadingElement>) {
  return <h3 className="text-slate-800">{p.children}</h3>
}

export function strong(p: Props<HTMLElement>) {
  return (
    <strong
      className="text-slate-700"
    >
      {p.children}
    </strong>
  )
}

export function a(p: Props<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a
      className="
        text-slate-700
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
    ">
      {p.children}
    </p>
  )
}

export function hr(p: Props<HTMLHRElement>) {
  return <hr className="border-gray-300 py-4" />
}

export function code(p: Props<HTMLElement>) {
  return (
    <code className="
      rounded
      py-px
      font-normal
      px-1
      text-sm
      bg-slate-300
      text-slate-800
      whitespace-nowrap
      before:content-['']
      after:content-['']
    ">
      {p.children}
    </code>
  )
}
