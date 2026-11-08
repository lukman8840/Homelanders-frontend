import type { AuthRole } from '../types/auth';

export type BackendRoleMap = Readonly<Record<string, readonly AuthRole[]>>;

export function createAuthRoleMapper(mapping: BackendRoleMap) {
  return (backendRoles: readonly string[]): AuthRole[] => {
    const roles = new Set<AuthRole>();

    for (const backendRole of backendRoles) {
      for (const role of mapping[backendRole] ?? []) {
        roles.add(role);
      }
    }

    return [...roles];
  };
}
