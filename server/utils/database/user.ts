import { eq, inArray } from 'drizzle-orm'
import { getUserCacheKey } from '../constants/cacheKeys'
import type { User } from '#shared/db'
import { CACHE_TTL } from '#shared/commonEnums'
import { IDatabaseService } from '~~/types/db/database-service'
import { useKV } from '../kv'
import type { CreateUserInput, UserUpdateInput } from '#shared/schemas/userSchema'

class UserService extends IDatabaseService<User> {
  private static instance: UserService

  private get db() {
    return useDB()
  }

  private get cache() {
    return useKV()
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  /**
   * Get a user by their ID (with caching)
   */
  async getById(id: number): Promise<User | undefined> {
    const cacheKey = getUserCacheKey(id)

    const cachedUser = await this.cache.get<User>(cacheKey)
    if (cachedUser) {
      return cachedUser
    }

    const user = await this.db
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, id))
      .get()

    if (user) {
      await this.cache.set<User>(cacheKey, user, { ttl: CACHE_TTL.ONE_DAY })
    }

    return user
  }

  /**
   * Get a user by their username
   */
  async getByUsername(username: string): Promise<User | undefined> {
    const user = await this.db
      .select()
      .from(tables.users)
      .where(eq(tables.users.username, username))
      .get()

    return user
  }

  /**
   * Get a user by their email
   */
  async getByEmail(email: string): Promise<User | undefined> {
    const user = await this.db
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, email))
      .get()

    return user
  }

  /**
   * Get all users
   */
  async getList(): Promise<User[]> {
    const users = await this.db
      .select()
      .from(tables.users)
      .all()

    return users
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserInput) {
    const newUser = await this.db
      .insert(tables.users)
      .values(data)
      .returning()
      .get()

    const cacheKey = getUserCacheKey(newUser.id)
    await this.cache.set<User>(cacheKey, newUser, { ttl: CACHE_TTL.ONE_DAY })

    return newUser
  }

  /**
   * Update a user by their ID
   * Updates cache after successful update
   */
  async update(data: UserUpdateInput) {
    const updatedUser = await this.db
      .update(tables.users)
      .set(data)
      .where(eq(tables.users.id, data.id))
      .returning()
      .get()

    const cacheKey = getUserCacheKey(data.id)
    if (updatedUser) {
      await this.cache.set<User>(cacheKey, updatedUser, { ttl: CACHE_TTL.ONE_DAY })
    }
    else {
      await this.cache.del(cacheKey)
    }

    return updatedUser
  }

  /**
   * Delete a user by their ID
   * Invalidates cache after deletion
   */
  async delete(id: number): Promise<void> {
    const cacheKey = getUserCacheKey(id)

    await this.db
      .delete(tables.users)
      .where(eq(tables.users.id, id))
      .execute()

    await this.cache.del(cacheKey)
  }

  /**
   * Delete multiple users by their IDs
   * Invalidates cache for all deleted users
   */
  async bulkDelete(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    await this.db
      .delete(tables.users)
      .where(inArray(tables.users.id, ids))
      .execute()

    await Promise.all(ids.map(id => this.cache.del(getUserCacheKey(id))))
  }
}

export default UserService.getInstance()
