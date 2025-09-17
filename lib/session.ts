// Session management utilities

export interface UserSession {
  id: string
  email: string
  name: string
  role: string
  isVerified: boolean
  isActive: boolean
}

export interface AdminSession {
  id: string
  email: string
  name: string
  role: 'ADMIN'
  permissions: string[]
}

// User session management
export const setUserSession = (user: UserSession) => {
  localStorage.setItem('user_session', JSON.stringify(user))
  // Clear admin session if exists
  localStorage.removeItem('admin_session')
}

export const getUserSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem('user_session')
  return session ? JSON.parse(session) : null
}

export const clearUserSession = () => {
  localStorage.removeItem('user_session')
}

// Admin session management
export const setAdminSession = (admin: AdminSession) => {
  localStorage.setItem('admin_session', JSON.stringify(admin))
  // Clear user session if exists
  localStorage.removeItem('user_session')
}

export const getAdminSession = (): AdminSession | null => {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem('admin_session')
  return session ? JSON.parse(session) : null
}

export const clearAdminSession = () => {
  localStorage.removeItem('admin_session')
}

// General session management
export const getCurrentSession = (): UserSession | AdminSession | null => {
  return getUserSession() || getAdminSession()
}

export const clearAllSessions = () => {
  localStorage.removeItem('user_session')
  localStorage.removeItem('admin_session')
}

export const isUserLoggedIn = (): boolean => {
  return getUserSession() !== null
}

export const isAdminLoggedIn = (): boolean => {
  return getAdminSession() !== null
}

export const isLoggedIn = (): boolean => {
  return isUserLoggedIn() || isAdminLoggedIn()
}
