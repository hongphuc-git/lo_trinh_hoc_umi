/**
 * Authentication error messages for user-facing display
 */
export const AUTH_ERROR_MESSAGES = {
  // Registration errors
  'validation': 'Please check your input and try again. All fields are required.',
  'captcha': 'Security verification failed. Please refresh the page and try again.',
  'existed': 'This username is already taken. Please choose a different username.',
  'unknown': 'An unexpected error occurred. Please try again later.',

  // Login errors
  'invalid-credentials': 'Invalid username or password. Please check your credentials and try again.',
} as const

export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES

/**
 * Get user-friendly error message by error code
 */
export function getAuthErrorMessage(errorCode: string | null | undefined): string | null {
  if (!errorCode) return null
  return AUTH_ERROR_MESSAGES[errorCode as AuthErrorCode] || 'An error occurred. Please try again.'
}
