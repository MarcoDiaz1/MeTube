import VideoFeed from './VideoFeed'

const Main = async () => {
  const res = await fetch('http://localhost:3000/api/pexels', {
    cache: 'no-store',
  })

  const data = await res.json()

  return <VideoFeed initialVideos={data.videos} />
}

export default Main
