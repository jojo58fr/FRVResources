import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildApiUrl } from '../data/frvtubersApi'
import type { ApiResource, ResourceItem } from '../data/resources'
import { mapApiResource } from '../data/resources'

type UseResourcesResult = {
  resources: ResourceItem[]
  loading: boolean
  error: string | null
  refresh: () => void
  languages: string[]
  tags: string[]
}

const parseResourcesPayload = (payload: unknown) => {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object' && 'resources' in payload) {
    const record = payload as { resources?: unknown }
    return Array.isArray(record.resources) ? record.resources : []
  }
  return []
}

export const useResources = (limit = 60): UseResourcesResult => {
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(buildApiUrl(`/api/resources?limit=${limit}`), {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        const message =
          errorPayload && typeof errorPayload === 'object' && 'error' in errorPayload
            ? String((errorPayload as { error?: string }).error)
            : `Erreur serveur (${response.status})`
        throw new Error(message)
      }

      const payload = await response.json()
      const items = parseResourcesPayload(payload) as ApiResource[]
      const mapped = items.map(mapApiResource)
      setResources(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des ressources.')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    void fetchResources()
  }, [fetchResources])

  const languages = useMemo(() => {
    const all = resources.flatMap((item) => item.languages)
    return Array.from(new Set(all)).sort()
  }, [resources])

  const tags = useMemo(() => {
    const all = resources.flatMap((item) => item.tags)
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
  }, [resources])

  return { resources, loading, error, refresh: fetchResources, languages, tags }
}
