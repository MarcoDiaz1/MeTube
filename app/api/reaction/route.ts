import { createClient } from '@supabase/supabase-js'
import prisma from '@/app/lib/prisma'

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (!user || error) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { videoId, reaction } = await req.json()

  if (!videoId || !reaction) {
    return new Response('Bad Request', { status: 400 })
  }

  const type = reaction === 'like' ? 'LIKE' : 'DISLIKE'

  // 🔥 check existing reaction
  const existing = await prisma.reaction.findUnique({
    where: {
      userId_videoId: {
        userId: user.id,
        videoId,
      },
    },
  })

  let userReaction: 'LIKE' | 'DISLIKE' | null = null

  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email!,
      username: user.email!.split('@')[0], // temporary
    },
  })

  if (existing) {
    if (existing.type === type) {
      // ❌ toggle OFF
      await prisma.reaction.delete({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId,
          },
        },
      })

      await prisma.video.update({
        where: { id: videoId },
        data: {
          [type === 'LIKE' ? 'likesCount' : 'dislikesCount']: {
            decrement: 1,
          },
        },
      })

      userReaction = null
    } else {
      // 🔁 switch reaction
      await prisma.reaction.update({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId,
          },
        },
        data: { type },
      })

      await prisma.video.update({
        where: { id: videoId },
        data: {
          likesCount: type === 'LIKE' ? { increment: 1 } : { decrement: 1 },
          dislikesCount:
            type === 'DISLIKE' ? { increment: 1 } : { decrement: 1 },
        },
      })

      userReaction = type
    }
  } else {
    // ➕ create new
    await prisma.reaction.create({
      data: {
        userId: user.id,
        videoId,
        type,
      },
    })

    await prisma.video.update({
      where: { id: videoId },
      data: {
        [type === 'LIKE' ? 'likesCount' : 'dislikesCount']: {
          increment: 1,
        },
      },
    })

    userReaction = type
  }

  // 🔥 counts AFTER mutation
  const [likes, dislikes] = await Promise.all([
    prisma.reaction.count({
      where: { videoId, type: 'LIKE' },
    }),
    prisma.reaction.count({
      where: { videoId, type: 'DISLIKE' },
    }),
  ])

  return Response.json({
    likes,
    dislikes,
    userReaction,
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const videoId = searchParams.get('videoId')

  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (!user || error) {
    return Response.json({ userReaction: null })
  }

  if (!token) {
    return Response.json({ userReaction: null })
  }

  if (!videoId) {
    return new Response('Bad Request', { status: 400 })
  }

  const reaction = await prisma.reaction.findUnique({
    where: {
      userId_videoId: { userId: user.id, videoId },
    },
  })

  return Response.json({ userReaction: reaction ? reaction.type : null })
}
