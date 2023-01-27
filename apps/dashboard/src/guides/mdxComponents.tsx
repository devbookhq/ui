import { ComponentProps } from 'react'
import type { MDXRemote } from 'next-mdx-remote'

import Text from 'components/typography/Text'

const lightMdxComponents: ComponentProps<typeof MDXRemote>['components'] = {
  h1(p) {
    return <h1 className="text-gray-800">{p.children}</h1>
  },
  h2(p) {
    return <h2 className="text-gray-800">{p.children}</h2>
  },
  h3(p) {
    return <h3 className="text-gray-800">{p.children}</h3>
  },
  strong(p) {
    return (
      <strong
        className="text-gray-800"
      >
        {p.children}
      </strong>
    )
  },
  a(p) {
    return (
      <a
        className="
          text-gray-800
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
  },
  li(p) {
    return (
      <li>
        <Text
          text=""
          className="text-gray-700"
          size={Text.size.S2}
          icon={p.children}
        // typeface={Text.typeface.InterBold}
        />
      </li>
    )
  },
  p(p) {
    return (
      <p className="
        text-gray-700
        text-base
        leading-7
      ">
        {p.children}
      </p>
    )
  },
  pre(p) {
    if ((p.children as any).type.name === 'code') {
      return (
        <pre className="
          font-mono
          py-3
          px-4
          border
          border-indigo-400/20
          bg-gray-800
          rounded-lg
          whitespace-pre-wrap
          text-sm
          overflow-initial
        ">
          {(p.children as any).props.children}
        </pre>
      )
    } else throw new Error('Don\'t know how to render the `pre` element')
  },
  code(p) {
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
  },
  Filetree(p) {
    return <div>[Filetree]</div>
  },
}

export { lightMdxComponents }
