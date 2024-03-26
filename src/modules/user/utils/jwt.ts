import { env } from 'config/env.config'
import { type JwtPayload, type Secret, sign, verify } from 'jsonwebtoken'

export function generateJWT(userId: string, expiration: number): string {
  const secret: Secret = env.TOKEN_SECRET
  const payload: JwtPayload = {
    sub: userId,
    exp: expiration,
    alg: 'HS256',
    typ: 'JWT',
    iss: env.SERVER_NAME,
  }

  const token = sign(payload, secret)

  return token
}

export async function validateJWT(token: string): Promise<boolean> {
  const result = await new Promise((resolve, reject) => {
    verify(token, env.TOKEN_SECRET, (err, decoded) => {
      if (err != null) {
        console.log('ERR', err)
        resolve(false)
      }
      resolve(true)
    })
  })

  return Boolean(result)
}
