import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildApiUrl } from '../data/frvtubersApi'

export type TagOption = {
  slug: string
  label?: string
  count: number
}

type TagsPayloadItem = {
  tag?: string
  slug?: string
  label?: string
  count?: number
  approvedCount?: number
  approved?: number
  total?: number
}

const normalizeTagItem = (item: TagsPayloadItem): TagOption | null => {
  const slug = item.slug ?? item.tag ?? item.label
  if (!slug) return null
  const count =
    typeof item.count === 'number'
      ? item.count
      : typeof item.approvedCount === 'number'
      ? item.approvedCount
      : typeof item.approved === 'number'
      ? item.approved
      : typeof item.total === 'number'
      ? item.total
      : 0

  return {
    slug,
    label: item.label,
    count,
  }
}

export const useResourceTags = () => {
  const [tags, setTags] = useState<TagOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(buildApiUrl('/api/resources/tags'), {
        headers: { Accept: 'application/json' },
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
      const list = Array.isArray(payload)
        ? payload
        : payload && typeof payload === 'object' && 'tags' in payload
        ? ((payload as { tags?: unknown }).tags as unknown[])
        : []

      const mapped = list
        .map((item) => (item && typeof item === 'object' ? (item as TagsPayloadItem) : null))
        .filter(Boolean)
        .map((item) => normalizeTagItem(item as TagsPayloadItem))
        .filter((item): item is TagOption => Boolean(item))

      setTags(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des tags.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTags()
  }, [fetchTags])

  const sorted = useMemo(
    () =>
      [...tags].sort((a, b) =>
        (a.label ?? a.slug).localeCompare(b.label ?? b.slug, 'fr', { sensitivity: 'base' }),
      ),
    [tags],
  )

  return { tags: sorted, loading, error, refresh: fetchTags }
}
