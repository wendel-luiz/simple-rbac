import { server } from 'config/di-container'

async function init(): Promise<void> {
  try {
    server.serve()
  } catch (err) {
    console.error(err)
    server.destroy()
  }
}

void init()
