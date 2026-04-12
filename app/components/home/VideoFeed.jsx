'use client'

import { useEffect, useState, useRef } from 'react'
import { VideoCard } from '../tools'

const VideoFeed = ({ initialVideos }) => {
  const [videos, setVideos] = useState(initialVideos)
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)

  const observerRef = useRef(null)

  const loadMore = async () => {
    if (loading) return
    setLoading(true)

    const res = await fetch(`/api/pexels?page=${page}`)
    const data = await res.json()

    setVideos((prev) => [...prev, ...data.videos])
    setPage((prev) => prev + 1)
    setLoading(false)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [page, loading])

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center my-10 ml-5 font-ruminate text-3xl">
        Popular Videos
      </div>

      <div className="mx-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={`${video.id}-${Math.random()}`} video={video} />
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
