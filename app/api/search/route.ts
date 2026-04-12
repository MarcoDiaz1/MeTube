export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') || '1'

  const res = await fetch(
    `https://api.pexels.com/v1/videos/search?query=${searchParams.get('query')}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    },
  )

  const data = await res.json()
  return Response.json(data)
}
