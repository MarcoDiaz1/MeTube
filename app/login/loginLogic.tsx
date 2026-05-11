'use client'

import React, { useState } from 'react'
import { FaEye, FaRegEye } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

type Props = {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginLogic = ({ setRegister }: Props) => {
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleEmailLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error(error.message)
      return
    }

    // user is logged in immediately
    router.push('/')
  }

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col items-center w-full mb-2">
        <input
          type="email"
          name="email"
          id=""
          className="bg-white w-[80%] text-black p-4 rounded-sm outline-none font-comfortaa"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-center w-full  mb-2">
        <div className="flex flex-col justify-center items-center w-[80%] relative bg-white p-4 rounded-sm">
          <input
            type={showPass ? 'text' : 'password'}
            name="password"
            id=""
            className="w-full text-black outline-none font-comfortaa"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute right-0 h-full w-1/12 flex items-center justify-center cursor-pointer text-black text-2xl bg-white "
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FaEye /> : <FaRegEye />}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-5">
        <button
          className="bg-[#fca311] text-black px-4 py-2 rounded-sm font-lemon w-[80%] cursor-pointer"
          onClick={handleEmailLogin}
        >
          Login
        </button>
        <div className="flex items-center w-[80%] my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-sm text-white whitespace-nowrap">
            or continue with
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="mt-3 flex items-center justify-center bg-white text-black py-2 rounded-sm w-[80%] font-lemon cursor-pointer"
        >
          <p className="pr-2">Continue with Google</p>
          <FcGoogle className="text-2xl" />
        </button>
      </div>
      <button
        className="text-[#fca311] underline mt-5 cursor-pointer"
        onClick={() => setRegister(true)}
      >
        Don&apos;t have an account? Sign up
      </button>
    </div>
  )
}

export default LoginLogic
