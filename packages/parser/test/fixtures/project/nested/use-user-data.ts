export function useUserData(userId: string): { name: string } {
  return { name: `user-${userId}` }
}
