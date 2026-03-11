import { userUpdateSchema } from '#shared/schemas/userSchema'
import userService from '~~/server/utils/database/user'

export default defineEventHandler(async (event) => {
  const userId = Number(getRouterParam(event, 'id'))
  if (Number.isNaN(userId)) {
    throw createError({ statusCode: 400, message: 'Invalid user ID' })
  }
  const result = await readValidatedBody(event, body => userUpdateSchema.safeParse(body))
  if (!result.success) {
    throw createError({ statusCode: 400, message: 'Invalid user data', data: result.error })
  }

  // Hash password if provided
  if (result.data.password && typeof result.data.password === 'string' && result.data.password.trim()) {
    result.data.password = await hashPassword(result.data.password)
  }

  const user = await userService.update(result.data)
  return { user }
})
