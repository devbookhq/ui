import {
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import {
  useUser,
} from '@supabase/supabase-auth-helpers/react'

import SpinnerIcon from 'components/icons/Spinner'
import TitleLink from 'components/TitleLink'
import AuthForm from 'components/AuthForm'

function SignIn() {
  const router = useRouter()
  const { user } = useUser()
  const isCreatingNewAccount = router.query.signup === 'true'

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  return (
    <>
      {user &&
        <div className="
          flex-1
          flex
          items-center
          justify-center
        ">
          <SpinnerIcon />
        </div>
      }
      {!user &&
        <div className="
            m-auto
            flex
            flex-col
            rounded
            space-y-4
          ">
          {!isCreatingNewAccount &&
            <>
              <AuthForm
                authType={AuthForm.type.SignIn}
              />
              <TitleLink
                size={TitleLink.size.T3}
                title="Create a new account"
                shallow
                href={{
                  pathname: router.pathname,
                  query: {
                    signup: 'true',
                  },
                }}
              />
            </>
          }
          {isCreatingNewAccount &&
            <>
              <AuthForm
                authType={AuthForm.type.SignUp}
              />
              <TitleLink
                size={TitleLink.size.T3}
                title="Sign in with an existing account"
                shallow
                href={{
                  pathname: router.pathname,
                }}
              />
            </>
          }
        </div>
      }
    </>
  )
}

export default SignIn
