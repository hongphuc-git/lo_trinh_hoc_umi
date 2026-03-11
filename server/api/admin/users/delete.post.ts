import userSchema from '~~/server/utils/database/user'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userIds } = body

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'User IDs array is required',
    })
  }
  await userSchema.bulkDelete(userIds)

  return {
    success: true,
    deleted: userIds.length,
  }
})
