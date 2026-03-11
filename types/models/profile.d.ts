export interface UserProfileModel {
  id: number
  username: string
  name: string
  email: string
  createdAt: Date
  lastLoginAt: Date
  hasPassword: boolean
  passkeyCount: number
  isAdmin: boolean
}
