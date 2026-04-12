export interface Video {
  id: number
  image: string
  duration: number
  url: string // keep if you want (page URL)

  user: {
    name: string
    url: string
    id: number
  }

  video_files: {
    id: number
    quality: string
    file_type: string
    width: number
    height: number
    link: string
  }[]
}
