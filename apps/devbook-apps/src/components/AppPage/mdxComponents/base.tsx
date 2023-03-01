import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react'

type Props<T, U extends HTMLAttributes<T> = HTMLAttributes<T>> = DetailedHTMLProps<U, T>

export function a(p: Props<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a
      className="
        text-slate-700
        font-bold
        border-b
        border-brand-500
        transition-all
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
