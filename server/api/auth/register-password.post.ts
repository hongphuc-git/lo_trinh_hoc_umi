import { registerUserSchema } from '#shared/schemas/userSchema'
import userService from '~~/server/utils/database/user'
import { apiRoutes } from '#shared/apiRoutes'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => registerUserSchema.safeParse(body))
  if (!result.success) {
    return sendRedirect(event, apiRoutes.AUTH_REGISTER + '?error=validation')
  }

  const { username, password, 'cf-turnstile-response': token } = result.data

  const tokenValidation = await verifyTurnstileToken(token)
  if (!tokenValidation.success) {
    return sendRedirect(event, apiRoutes.AUTH_REGISTER + '?error=captcha')
  }

  const existingUser = await userService.getByUsername(username)
  if (existingUser) {
    return sendRedirect(event, apiRoutes.AUTH_REGISTER + '?error=existed')
  }

  const hashedPassword = await hashPassword(password)
  const newUser = await userService.create({
    ...result.data,
    password: hashedPassword,
    isAdmin: false,
  })

  // we only set necessary properties from user object
  await setUserSession(event, {
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
    },
  })

  if (result.data['redirect-to']) {
    return sendRedirect(event, result.data['redirect-to'])
  }
  else {
    return sendRedirect(event, '/')
  }
})
