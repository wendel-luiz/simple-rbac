import { Server } from 'server'

let server

try {
  server = new Server()
} catch (err) {
  console.error(err)
  server?.destroy()
}
