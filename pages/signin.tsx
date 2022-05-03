import {
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { useUser } from 'utils/useUser'
import GitHubButton from 'components/GitHubButton'
import Edit from '@/components/Edit'


function SignIn() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('')


  async function signInWithGitHub() {
    setIsLoading(true)
    const { error } = await supabaseClient.auth.signIn({ provider: 'github' });
    if (error) {
      setErrMessage(error.message)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user])

  if (!user) {
    return (
      <div className="
        m-auto
        flex
        rounded
      ">
        <Edit initialContent='const a = 5;'></Edit>
        <div className="
          p-4
          w-[300px]
          flex
          flex-col
          space-y-16
          items-center
          bg-black-800
        ">
          <h2>Sign Up</h2>
          <GitHubButton
            onClick={signInWithGitHub}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      Loading...
    </div>
  )
}

export default SignIn
