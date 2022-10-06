import {
  withPageAuth,
} from '@supabase/supabase-auth-helpers/nextjs'
import Editor from 'components/Editor'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx) {
    return {
      props: {}
    }
  }
})

interface Props {

}

function AppEditor({ }: Props) {
  return (
    <div>
      <Editor />
    </div>
  )
}

export default AppEditor
