import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    // 🔑 create session
    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code)

    const user = session?.user

    if (user) {
      // ✅ sync user into Prisma DB
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email!,
          username: user.email?.split('@')[0] || 'user',
        },
      })
    }
  }

  return NextResponse.redirect(new URL('/', req.url))
}
