export type ApiResource = {
  id: string
  submitterName?: string | null
  submitterEmail?: string | null
  submitterDiscord?: string | null
  assetTitle: string
  creatorName: string
  assetUrl: string
  assetType?: string | null
  description?: string | null
  previewImageUrl?: string | null
  price?: number | null
  languages?: string[] | null
  tags?: string[] | null
  status?: string | null
  createdAt?: string | null
  clickCount?: number | null
}

export type ResourceItem = {
  id: string
  title: string
  creator: string
  description: string
  link: string
  type: string | null
  previewImageUrl?: string
  price?: number | null
  languages: string[]
  tags: string[]
  accent: string
  clickCount?: number | null
  createdAt?: string | null
}

export const languageOptions = [
  { value: 'FR', label: 'FR' },
  { value: 'EN', label: 'EN' },
  { value: 'OTHER', label: 'Autres' },
]

const accents = ['#F7B9A6', '#F4C58B', '#B5D8F6', '#D7BDE8', '#CAB1D8', '#9AD6C9', '#F0B7C3']

const hashString = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

const normalizeLanguages = (languages?: string[] | null) => {
  if (!languages || !languages.length) return []
  return languages
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
}

const normalizeTags = (tags?: unknown[] | null) => {
  if (!tags || !tags.length) return []
  return tags
    .map((item) => {
      if (typeof item === 'string') return item.trim()
      if (item && typeof item === 'object') {
        const record = item as { slug?: unknown; label?: unknown }
        if (typeof record.slug === 'string') return record.slug.trim()
        if (typeof record.label === 'string') return record.label.trim()
      }
      return ''
    })
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
}

export const mapApiResource = (resource: ApiResource): ResourceItem => {
  const accent = accents[hashString(resource.id ?? resource.assetTitle) % accents.length]
  return {
    id: resource.id,
    title: resource.assetTitle,
    creator: resource.creatorName,
    description: resource.description?.trim() || 'Aucune description fournie pour cette ressource.',
    link: resource.assetUrl,
    type: resource.assetType?.trim() || null,
    previewImageUrl: resource.previewImageUrl?.trim() || undefined,
    price: typeof resource.price === 'number' ? resource.price : null,
    languages: normalizeLanguages(resource.languages),
    tags: normalizeTags(resource.tags),
    accent,
    clickCount: typeof resource.clickCount === 'number' ? resource.clickCount : null,
    createdAt: resource.createdAt ?? null,
  }
}
