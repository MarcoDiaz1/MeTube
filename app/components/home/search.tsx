'use client'

import { Video } from '@/app/types'
import React, { useState, useEffect, useRef } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { parsePexelsUrl } from '@/app/lib/utils'

const Search = () => {
  const [query, setQuery] = useState('')
  const [dropDown, setDropDown] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropDown(false)
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropDown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!query) {
      return
    }

    const timeout = setTimeout(async () => {
      setDropDown(true)
      setLoading(true)

      const res = await fetch(`/api/search?query=${query}`)
      const data = await res.json()

      setResults(data.videos || [])
      setLoading(false)
    }, 200) // debounce delay

    return () => clearTimeout(timeout)
  }, [query])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return
    setDropDown(false)
    router.push(`/search?query=${encodeURIComponent(query)}`)
  }

  return (
    <form
      ref={wrapperRef}
      className="relative flex flex-row items-center w-10/12 h-full"
      onSubmit={handleSearch}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClick={() => query && setDropDown(true)}
        type="search"
        placeholder="Search..."
        className={`bg-white w-10/12 h-2/5 ${query ? 'rounded-b-none' : 'rounded-l-md'} px-4 focus:outline-none text-black`}
      />
      <button
        className="w-[5%] h-2/5 bg-gray-300 hover:bg-gray-400 flex items-center justify-center cursor-pointer"
        type="submit"
      >
        <HiOutlineSearch className="text-black" />
      </button>
      {query && dropDown && (
        <div className="absolute top-[7vh] w-10/12 bg-white text-black rounded-x rounded-top-none shadow-lg max-h-60 overflow-y-auto z-50">
          {loading && <p className="p-2">Searching...</p>}

          {!loading && results.length === 0 && (
            <p className="p-2">No results</p>
          )}

          {results.map((video: Video) => (
            <div
              key={video.id}
              onClick={() => {
                router.push(`/video/${video.id}`)
                setDropDown(false)
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {parsePexelsUrl(video.url)}
            </div>
          ))}
        </div>
      )}
    </form>
  )
}

export default Search
