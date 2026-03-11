import userService from '~~/server/utils/database/user'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID',
    })
  }

  await userService.delete(id)
  return { success: true }
})
