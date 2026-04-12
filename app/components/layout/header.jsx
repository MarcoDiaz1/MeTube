import React from 'react'
import { MdOutlineAirplay } from 'react-icons/md'
import { FaRegUserCircle } from 'react-icons/fa'
import Link from 'next/link'

import Search from '../home/search'

const HeaderComp = () => {
  return (
    <div className="flex w-full h-[10vh] bg-[crimson]">
      <Link
        href="/"
        className="flex px-[2vw] h-full w-2/12 items-center font-lemon text-2xl"
      >
        <MdOutlineAirplay className="mr-3" />
        <p>MeTube</p>
      </Link>
      <Search />
      <div className="w-1/12 text-3xl flex items-center justify-center2 cursor-pointer">
        <FaRegUserCircle />
      </div>
    </div>
  )
}

export default HeaderComp
