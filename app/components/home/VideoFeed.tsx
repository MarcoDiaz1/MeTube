'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { VideoCard } from '../../lib/client-tools'
import { Video } from '../../types'

const VideoFeed = ({
  initialVideos,
  query,
}: {
  initialVideos: Video[]
  query?: string
}) => {
  const [videos, setVideos] = useState(initialVideos)
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(2)

  const observerRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return

    loadingRef.current = true
    setLoading(true)

    try {
      const endpoint = query
        ? `/api/search?query=${query}&page=${pageRef.current}`
        : `/api/pexels?page=${pageRef.current}`

      const res = await fetch(endpoint)
      const data = await res.json()

      if (data.videos.length === 0) {
        setHasMore(false)
        return
      }

      setVideos((prev) => {
        const map = new Map(prev.map((v) => [v.id, v]))

        for (const v of data.videos) {
          map.set(v.id, v)
        }

        return Array.from(map.values())
      })

      setPage((prev) => {
        pageRef.current = prev + 1
        return prev + 1
      })
    } catch (err) {
      console.error(err)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [query, page])

  useEffect(() => {
    setVideos(initialVideos)
    setPage(2)
    pageRef.current = 2
    setHasMore(true)
  }, [query, initialVideos])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    })

    const current = observerRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  useEffect(() => {
    setVideos(initialVideos)
    setPage(2)
  }, [query, initialVideos])

  console.log(page)

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center my-10 ml-5 font-ruminate text-3xl">
        Popular Videos
      </div>

      <div className="mx-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video: Video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* trigger element */}
      <div
        ref={observerRef}
        className="h-[10vh] flex items-center justify-center bg-[crimson] text-white font-ruminate text-lg rounded-lg my-10"
      >
        {loading && <p>Loading...</p>}
      </div>
    </div>
  )
}

export default VideoFeed
