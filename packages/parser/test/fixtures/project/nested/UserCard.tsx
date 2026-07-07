import { createContext, useContext } from 'react'
import { useUserData } from './use-user-data'

const ThemeContext = createContext<'light' | 'dark'>('light')

interface UserCardProps {
  userId: string
}

/** Renders a user's card — depends on context and a data hook. */
export function UserCard({ userId }: UserCardProps) {
  const theme = useContext(ThemeContext)
  const user = useUserData(userId)
  return (
    <div data-theme={theme}>
      <span>{user.name}</span>
    </div>
  )
}
