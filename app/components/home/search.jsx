'use client'

import React, { useState, useEffect } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)

      const res = await fetch(`/api/search?query=${query}`)
      const data = await res.json()

      setResults(data.videos || [])
      setLoading(false)
    }, 200) // debounce delay

    return () => clearTimeout(timeout)
  }, [query])

  console.log(results)

  return (
    <div className="relative flex flex-row items-center w-10/12 h-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        placeholder="Search..."
        className={`bg-white w-10/12 h-2/5 ${query ? 'rounded-b-none' : 'rounded-l-md'} px-4 focus:outline-none text-black`}
      />
      <button className="w-[5%] h-2/5 bg-gray-300 hover:bg-gray-400 flex items-center justify-center cursor-pointer">
        <HiOutlineSearch className="text-black" />
      </button>
      {query && (
        <div className="absolute top-[7vh] w-10/12 bg-white text-black rounded-x rounded-top-none shadow-lg max-h-60 overflow-y-auto z-50">
          {loading && <p className="p-2">Searching...</p>}

          {!loading && results.length === 0 && (
            <p className="p-2">No results</p>
          )}

          {results.map((video) => (
            <div
              key={video.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {video.user.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
