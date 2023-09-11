import { auth, del, get, set } from './store'

type Method = 'GET' | 'POST' | 'DELETE'

type Route = {
  [key in Method]?: (req: Request) => Promise<Response>
}

const publicRoutes = ['/']

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
    GET: async (req: Request) => Response.json(get(key(req))),
    POST: async (req: Request) => {
      const jsonBody = await req.json()
      set(jsonBody, key(req))
      return Response.json(jsonBody)
    },
    DELETE: async (req: Request) => Response.json(del(key(req)))
  }
}

const getToken = (req: Request) =>
  req.headers.get('Authorization')?.split(' ')[1] || '___anon'

const getStoreId = (req: Request) =>
  new URL(req.url).pathname.split('/store/')[1] || '___public'

const key = (req: Request) => `${getToken(req)}-${getStoreId(req)}`

const e404 = () => new Response('Not found', { status: 404 })

export const router = (req: Request) => {
  const { method, url } = req
  const pathname = new URL(url).pathname
  const endpoint = `/${pathname.split('/')[1]}`

  const token = getToken(req)

  if (!publicRoutes.includes(pathname) && !auth(token)) {
    return new Response(
      `Please request access to this store before accessing it.`,
      { status: 401 }
    )
  }

  return routes[endpoint]?.[method as Method]?.(req) || e404()
}
