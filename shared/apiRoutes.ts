import type { NuxtSecurityRouteRules } from 'nuxt-security'

export const apiRoutes = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',

  MY_PROFILE: '/api/users/me',
}

const apiRules: NuxtSecurityRouteRules = {
  rateLimiter: {
    tokensPerInterval: 150,
    interval: 60000, // 60 seconds
    headers: true,
    throwError: true,
  },
}

export const routeRules = {
  '/api/admin/seed': {
    security: {
      rateLimiter: {
        tokensPerInterval: 5,
        interval: 3 * 60 * 60 * 24 * 1000, // 3 days
        headers: true,
        throwError: true,
      },
    },
  },
  '/api/**': {
    security: apiRules,
  },
} as const
