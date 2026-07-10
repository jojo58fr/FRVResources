import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type SeoProps = {
  title?: string
  description?: string
  keywords?: string
  image?: string
  type?: 'website' | 'article'
  canonicalPath?: string
  noIndex?: boolean
  schema?: Array<Record<string, unknown>>
}

const siteName = 'FRVResources'
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://resources.frvtubers.com'
const defaultTitle = 'Ressources VtuberFR, assets VTuber, Live2D et overlays'
const defaultDescription =
  'FRVResources est un hub de ressources VTuberFR : assets vtuber, live2D FR, overlays, emotes, widgets et outils pour la communaut\u00e9 vtubing fran\u00e7aise.'
const defaultKeywords =
  'ressources pour vtuberfr, assets vtuber, asset vtuberfr, live2d fr, vtubing fr, overlay vtuber, emotes vtuber, widget stream'
const defaultImage = '/FRVtubers_Vresources.png'

const clampDescription = (value?: string) => {
  if (!value) return ''
  const trimmed = value.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 160) return trimmed
  return `${trimmed.slice(0, 157).trim()}...`
}

const ensureMeta = (selector: string, content: string, attribute = 'name') => {
  const meta = document.querySelector(`meta[${attribute}="${selector}"]`) ?? (() => {
    const element = document.createElement('meta')
    element.setAttribute(attribute, selector)
    document.head.appendChild(element)
    return element
  })()
  meta.setAttribute('content', content)
}

const ensureLink = (rel: string, href: string) => {
  const link = document.querySelector(`link[rel="${rel}"]`) ?? (() => {
    const element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
    return element
  })()
  link.setAttribute('href', href)
}

const setJsonLd = (schema?: Array<Record<string, unknown>>) => {
  document.querySelectorAll('script[data-seo="ldjson"]').forEach((node) => node.remove())
  if (!schema || schema.length === 0) return
  schema.forEach((item, index) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo', 'ldjson')
    script.setAttribute('data-index', String(index))
    script.text = JSON.stringify(item)
    document.head.appendChild(script)
  })
}

export const Seo = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  canonicalPath,
  noIndex = false,
  schema,
}: SeoProps) => {
  const location = useLocation()

  useEffect(() => {
    const metaTitle = title ? `${title} | ${siteName}` : defaultTitle
    const metaDescription = clampDescription(description || defaultDescription)
    const metaKeywords = keywords || defaultKeywords
    const canonicalUrl = new URL(canonicalPath ?? location.pathname, siteUrl).toString()
    const imageUrl = new URL(image || defaultImage, siteUrl).toString()

    document.title = metaTitle

    ensureMeta('description', metaDescription)
    ensureMeta('keywords', metaKeywords)
    ensureMeta(
      'robots',
      noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    )
    ensureMeta('og:title', metaTitle, 'property')
    ensureMeta('og:description', metaDescription, 'property')
    ensureMeta('og:type', type, 'property')
    ensureMeta('og:url', canonicalUrl, 'property')
    ensureMeta('og:image', imageUrl, 'property')
    ensureMeta('og:site_name', siteName, 'property')
    ensureMeta('og:locale', 'fr_FR', 'property')
    ensureMeta('twitter:card', 'summary_large_image')
    ensureMeta('twitter:title', metaTitle)
    ensureMeta('twitter:description', metaDescription)
    ensureMeta('twitter:image', imageUrl)

    ensureLink('canonical', canonicalUrl)

    setJsonLd(schema)
  }, [title, description, keywords, image, type, canonicalPath, noIndex, schema, location.pathname])

  return null
}
