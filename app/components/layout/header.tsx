'use client'

import React, { useEffect, useState } from 'react'
import { MdOutlineAirplay } from 'react-icons/md'
import { FaRegUserCircle } from 'react-icons/fa'
import Link from 'next/link'

import { supabase } from '@/app/lib/supabase'
import { useAuth } from '@/app/context/AuthContext'

import Search from '../home/search'

const HeaderComp = () => {
  const [openToolTip, setOpenToolTip] = useState(false)

  const { user } = useAuth()

  const userName =
    user?.user_metadata.username || user?.user_metadata.full_name || user?.email

  useEffect(() => {
    const handleClick = () => setOpenToolTip(false)

    window.addEventListener('click', handleClick)

    return () => window.removeEventListener('click', handleClick)
  }, [])

  const handleUserAction = () => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setOpenToolTip((prev) => !prev)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="flex w-full h-[10vh] bg-[#14213d]">
      <Link
        href="/"
        className="flex px-[2vw] h-full w-2/12 items-center font-lemon text-2xl"
      >
        <MdOutlineAirplay className="mr-3 text-[#fca311]" />
        <p>MeTube</p>
      </Link>

      <Search />

      <div
        className="w-1/12 text-3xl flex items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          handleUserAction()
        }}
      >
        <FaRegUserCircle />
      </div>

      {openToolTip && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[8vh] right-[1.5vw] h-[25vh] bg-[#1d2d44] text-white rounded-md p-5 w-48 flex flex-col items-center justify-around z-40"
        >
          <div className="w-full flex items-center justify-center border-b pb-2 mb-2">
            <p className="text-sm text-[#fca311]">{userName}</p>
          </div>

          <Link
            href="/profile"
            className="cursor-pointer"
            onClick={() => setOpenToolTip(false)}
          >
            Profile
          </Link>

          <Link
            href="/dashboard"
            className="cursor-pointer"
            onClick={() => setOpenToolTip(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/settings"
            className="cursor-pointer"
            onClick={() => setOpenToolTip(false)}
          >
            Settings
          </Link>

          <div className="border-t mt-2 pt-2 w-full flex items-center justify-center">
            <button className="cursor-pointer" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeaderComp
