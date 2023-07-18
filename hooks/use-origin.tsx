import { useIsMounted } from '@/hooks/use-mounted'

export const useOrigin = () => {
  const isMounted = useIsMounted()

  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : ''

  if (!isMounted) {
    return null
  }

  return origin
}
