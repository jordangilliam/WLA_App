export const ROLE_HIERARCHY = {
  student: 0,
  parent: 1,
  educator: 2,
  teacher: 2,
  admin: 3,
  partner: 3,
} as const

export type UserRole = keyof typeof ROLE_HIERARCHY

export function hasRequiredRole(current: UserRole, required: UserRole) {
  return ROLE_HIERARCHY[current] >= ROLE_HIERARCHY[required]
}

