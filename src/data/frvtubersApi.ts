export const API_ORIGIN = import.meta.env.VITE_FRVTUBERS_API_ORIGIN ?? 'http://localhost:3000'

export const buildApiUrl = (path: string) => {
  if (!path) return API_ORIGIN
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export const trackResourceClick = async (resourceId: string) => {
  if (!resourceId) return
  try {
    await fetch(buildApiUrl(`/api/resources/${resourceId}/click`), {
      method: 'POST',
      keepalive: true,
    })
  } catch {
    // Ignore tracking failures to avoid blocking navigation.
  }
}
