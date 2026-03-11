declare module '#auth-utils' {
  interface User {
    id: number
    username: string
    name: string
    isAdmin: boolean
  }

  interface UserSession {
    loggedInAt?: Date
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SecureSessionData {
    // Add your own secure session fields here if needed
  }
}

export { }
