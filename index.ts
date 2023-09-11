import { router } from './router'

const server = Bun.serve({
  fetch: router
})

console.log(`Bun 🥝 - Listening on http://localhost:${server.port}`)
