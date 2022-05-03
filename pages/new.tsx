import Link from 'next/link'

import Title from 'components/typography/Title'
import CodeEditor from 'components/CodeEditor'

function New() {
  return (
    <div className="
      flex
      flex-col
      space-y-16
    ">
      <div className="
        flex
        items-center
        space-x-2
      ">
        <Link href="/">
          <a className="
            hover:no-underline
          ">
            <Title
              className="
                hover:text-white-900
              "
              rank={Title.rank.Secondary}
            >
              Code Snippets
            </Title>
          </a>
        </Link>
        <Title>/</Title>
        <Title>New</Title>
      </div>

      <div className="bg-black-800">
        <CodeEditor
          content="const a = 5;"
        />
      </div>
    </div>
  )
}


export default New
