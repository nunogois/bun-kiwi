import { file } from 'bun'
import { mkdir } from 'fs'

let tokens = new Set<string>()
let store = new Map<string, unknown>()

export const check = (token: string) => !tokens.size || tokens.has(token)

export const get = (key: string) => store.get(key)

export const set = (value: unknown, key: string) => {
  store.set(key, value)
  save()
}

export const del = (key: string) => {
  store.delete(key)
  save()
}

const load = async () => {
  console.time('Tokens loaded')
  console.time('Store loaded')

  try {
    tokens = new Set((await file(`./tokens.txt`).text()).split('\n'))
    console.timeEnd('Tokens loaded')
  } catch (_) {}

  try {
    store = new Map(Object.entries(await file(`./data/data.json`).json()))
    console.timeEnd('Store loaded')
  } catch (_) {}
}

const save = async () => {
  await mkdir(`./data`, { recursive: true }, err => {
    if (err) throw err
  })
  await Bun.write(
    './data/data.json',
    JSON.stringify(Object.fromEntries(store), null, 2)
  )
}

await load()
