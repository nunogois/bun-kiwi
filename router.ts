import { check, del, get, set } from './store'

type RequestWithParam = Request & { param?: string }

type Method = 'GET' | 'POST' | 'DELETE'

type Route = {
  [key in Method]?: (req: RequestWithParam, key: string) => Promise<Response>
}

const routes: Record<string, Route> = {
  '/': {
    GET: async () =>
      await new Response(
        `Bun 🥝 - <a href="https://github.com/nunogois/bun-kiwi">GitHub</a>`,
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        }
      )
  },
  '/store': {
    GET: async (req: RequestWithParam, key: string) => Response.json(get(key)),
    POST: async (req: RequestWithParam, key: string) => {
      const jsonBody = await req.json()
      set(jsonBody, key)
      return Response.json(jsonBody)
    },
    DELETE: async (req: RequestWithParam, key: string) =>
      Response.json(del(key))
  }
}

const e404 = () => new Response('Not found', { status: 404 })

export const router = (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1] || '___all'

  if (!check(token)) {
    return new Response(
      `Please request access to this store before accessing it.`,
      { status: 401 }
    )
  }

  const { method, url } = req
  const pathname = new URL(url).pathname
  const endpoint = `/${pathname.split('/')[1]}`

  const storeId = pathname.split('/store/')[1] || '___public'

  return (
    routes[endpoint]?.[method as Method]?.(req, `${token}-${storeId}`) || e404()
  )
}
