import {
  useRef,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import cn from 'classnames'

import Title from 'components/typography/Title'
import Input from 'components/Input'
import Button from 'components/Button'

function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('')

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  function handleKeyDown(e: any) {
    if (e.key === 'Enter') signInWithEmail()
  }

  async function signInWithEmail() {
    setIsLoading(true)

    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    const { error } = await supabaseClient.auth.signIn({
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
          items-center
          rounded
          bg-black-800
        ">
      <Title
        title="Sign in"
        size={Title.size.T1}
      />
      <div className="flex flex-col space-y-2 flex-1 min-w-0">
        <input
          ref={emailRef}
          className={cn(
            'px-2.5',
            'py-2',
            'rounded-lg',
            'border',
            'border-black-700',
            'bg-black-900',
            'outline-none',
            'focus:border-green-200',
            'text-sm',
            'font-semibold',
            'placeholder:text-gray-600',
          )}
          required
          autoFocus
          name="email"
          autoComplete="username email"
          placeholder="Email"
          type="text"
        />
        <input
          ref={passwordRef}
          className={cn(
            'px-2.5',
            'py-2',
            'rounded-lg',
            'border',
            'flex',
            'min-w-0',
            'flex-1',
            'border-black-700',
            'bg-black-900',
            'outline-none',
            'focus:border-green-200',
            'text-sm',
            'font-semibold',
            'placeholder:text-gray-600',
          )}
          required
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
        />
      </div>
      <input type="submit" hidden />
      <div>
        <Button
          text="Sign In"
          onClick={signInWithEmail}
          variant={Button.variant.Full}
        />
      </div>
      {isLoading}
      {errMessage}
    </div>
  )
}

export default SignInForm
