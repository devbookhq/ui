import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import cn from 'classnames'

import Text from 'components/typography/Text'
import SpinnerIcon from 'components/icons/Spinner'
import Title from 'components/typography/Title'
import Button from 'components/Button'

function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('\n')

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(function autofocusEmailInput() {
    if (errMessage !== '') {
      if (!emailRef.current?.value) {
        emailRef.current?.focus()
      } else if (!passwordRef.current?.value) {
        passwordRef.current?.focus()
      } else {
        emailRef.current?.focus()
      }
      return
    }

    emailRef.current?.focus()
  }, [errMessage, isLoading])

  function handleKeyDown(e: any) {
    if (e.key === 'Enter') signInWithEmail()
  }

  async function signInWithEmail() {
    setIsLoading(true)

    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!email) {
      setErrMessage('Email must not be empty')
      setIsLoading(false)
      return
    }

    if (!password) {
      setErrMessage('Password must not be empty')
      setIsLoading(false)
      return
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
    if (error) {
      setErrMessage(error.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="
        py-12
        px-4
        w-[450px]
        flex
        flex-1
        flex-col
        space-y-8
        self-start
        rounded
        bg-black-800
      ">
      <Title
        title="Create a new account"
        size={Title.size.T1}
      />
      <div className="flex flex-col px-16 space-y-8">
        <div className="flex flex-col space-y-2 min-w-0">
          <input
            ref={emailRef}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={cn(
              'px-2.5',
              'py-2',
              'rounded-lg',
              'border',
              'border-black-700',
              { 'bg-black-900': !isLoading },
              { 'bg-black-800': isLoading },
              'outline-none',
              'focus:border-green-200',
              'text-sm',
              'font-semibold',
              'placeholder:text-gray-600',
            )}
            name="email"
            autoComplete="username email"
            placeholder="Email"
            type="text"
          />
          <input
            disabled={isLoading}
            ref={passwordRef}
            onKeyDown={handleKeyDown}
            className={cn(
              'px-2.5',
              'py-2',
              'rounded-lg',
              'border',
              'flex',
              'min-w-0',
              'flex-1',
              'border-black-700',
              { 'bg-black-900': !isLoading },
              { 'bg-black-800': isLoading },
              'outline-none',
              'focus:border-green-200',
              'text-sm',
              'font-semibold',
              'placeholder:text-gray-600',
            )}
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
          />
        </div>
        <div className="flex flex-col space-y-4 flex-shrink-0">
          <Button
            isDisabled={isLoading}
            className="self-center"
            text="Sign up"
            onClick={signInWithEmail}
            variant={Button.variant.Full}
          />
          {!isLoading && <Text
            text={errMessage}
            size={Text.size.S2}
            className="text-red-400 self-center"
          />
          }
          {isLoading &&
            <div className="
              flex-1
              flex
              items-center
              justify-center
            ">
              <SpinnerIcon />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default SignInForm
