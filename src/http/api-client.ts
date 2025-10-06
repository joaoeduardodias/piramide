import { getCookie } from 'cookies-next';
import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')

          const token = getCookie('token', { cookies: serverCookies })
          if (token) {
            request.headers.set('Authorization', `Bearer ${token.toString()}`)
          }
        } else {
          const token = getCookie('token')
          if (token) {
            request.headers.set('Authorization', `Bearer ${token.toString()}`)
          }

        }
      },
    ]
  }
})
