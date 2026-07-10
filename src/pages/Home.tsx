import { useMemo, useState } from 'react'
import { FilterBar } from '../components/FilterBar'
import { ResourceCard } from '../components/ResourceCard'
import { Seo } from '../components/Seo'
import { useResources } from '../hooks/useResources'
import { useResourceTags } from '../hooks/useResourceTags'
import shared from '../styles/shared.module.scss'
import styles from './Home.module.scss'

const formatDateLabel = (value?: string | null) => {
  if (!value) return 'Date non renseignée'

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return 'Date non renseignée'

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}

export const Home = () => {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('')
  const [showPaid, setShowPaid] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('newest')
  const { resources, loading, error, languages } = useResources()
  const { tags } = useResourceTags()
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://resources.frvtubers.com'

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'FRVResources',
      url: siteUrl,
      inLanguage: 'fr-FR',
      description:
        'Ressources VtuberFR : assets vtuber, live2D FR, overlays, emotes, widgets et outils pour la communaut\u00e9 vtubing fran\u00e7aise.',
      keywords:
        'ressources pour vtuberfr, assets vtuber, asset vtuberfr, live2d fr, vtubing fr, overlay vtuber, emotes vtuber, widget stream',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'FRVtubers',
      url: 'https://frvtubers.com',
      logo: `${siteUrl}/FRVtubersLogo.png`,
      sameAs: ['https://discord.gg/meyHQYWvjU'],
    },
  ]

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const normalizedMin = priceMin.trim()
    const normalizedMax = priceMax.trim()
    const minValue = normalizedMin ? Number(normalizedMin) : null
    const maxValue = normalizedMax ? Number(normalizedMax) : null
    const hasMin = minValue !== null && !Number.isNaN(minValue)
    const hasMax = maxValue !== null && !Number.isNaN(maxValue)

    const base = resources.filter((resource) => {
      const isPaid = typeof resource.price === 'number' && resource.price > 0
      const matchesLanguage = language ? resource.languages.includes(language) : true
      const matchesPaid = showPaid ? true : !isPaid
      const matchesTags =
        selectedTags.length === 0
          ? true
          : selectedTags.some((tag) => resource.tags.includes(tag))
      const matchesPrice =
        showPaid && (hasMin || hasMax)
          ? isPaid &&
            (!hasMin || (resource.price as number) >= minValue!) &&
            (!hasMax || (resource.price as number) <= maxValue!)
          : true
      const matchesSearch = term
        ? [
            resource.title,
            resource.creator,
            resource.description,
            resource.languages.join(' '),
            resource.tags.join(' '),
          ]
            .join(' ')
            .toLowerCase()
            .includes(term)
        : true

      return matchesLanguage && matchesPaid && matchesPrice && matchesSearch && matchesTags
    })

    if (sortBy === 'featured') {
      return base
    }

    const withIndex = base.map((item, index) => ({ item, index }))
    const parseDate = (value?: string | null) => {
      if (!value) return 0
      const parsed = Date.parse(value)
      return Number.isNaN(parsed) ? 0 : parsed
    }

    withIndex.sort((a, b) => {
      if (sortBy === 'newest' || sortBy === 'oldest') {
        const aDate = parseDate(a.item.createdAt)
        const bDate = parseDate(b.item.createdAt)
        const diff = sortBy === 'newest' ? bDate - aDate : aDate - bDate
        return diff !== 0 ? diff : a.index - b.index
      }

      const aClicks = a.item.clickCount ?? 0
      const bClicks = b.item.clickCount ?? 0
      const diff = sortBy === 'most_popular' ? bClicks - aClicks : aClicks - bClicks
      return diff !== 0 ? diff : a.index - b.index
    })

    return withIndex.map(({ item }) => item)
  }, [search, language, showPaid, priceMin, priceMax, resources, selectedTags, sortBy])

  const stats = useMemo(() => {
    const creatorCount = new Set(
      resources.map((resource) => resource.creator.trim().toLowerCase()).filter(Boolean),
    ).size
    const freeCount = resources.filter(
      (resource) => resource.price === 0 || resource.price === null,
    ).length
    const paidCount = resources.filter(
      (resource) => typeof resource.price === 'number' && resource.price > 0,
    ).length
    const latestTimestamp = resources.reduce((latest, resource) => {
      const parsed = resource.createdAt ? Date.parse(resource.createdAt) : Number.NaN
      return Number.isNaN(parsed) ? latest : Math.max(latest, parsed)
    }, 0)

    return {
      creatorCount,
      freeCount,
      paidCount,
      latestDate: latestTimestamp ? formatDateLabel(new Date(latestTimestamp).toISOString()) : 'Date non renseignée',
    }
  }, [resources])

  return (
    <div className={shared.page}>
      <Seo
        title="Ressources VTuberFR, assets VTuber, Live2D FR et overlays"
        description="Le hub FRVResources pour trouver des ressources VTuberFR : assets vtuber, live2D FR, overlays, emotes, widgets et outils pour le vtubing FR."
        keywords="ressources pour vtuberfr, assets vtuber, asset vtuberfr, live2d fr, vtubing fr, overlay vtuber, emotes vtuber, widget stream"
        schema={schema}
      />
      <section className={shared.section}>
        <div className={shared.container}>
          <div className={styles.introGrid}>
            <div className={styles.introMain}>
              <p className={shared.eyebrow}>FRVResources</p>
              <h1>Ressources gratuites et payantes pour VtuberFR</h1>
              <p className={styles.introLead}>
                Retrouvez des assets VTuber (Overlay, Live2D, Emotes, Widgets, alertes) gratuits ou payants pour vos streams et le VTubing FR.
              </p>
            </div>
            <aside className={styles.introAside}>
              <div className={styles.infoBlock}>
                <h2>Liens utiles</h2>
                <div className={styles.linkStack}>
                  <a
                    className={styles.utilityLink}
                    href="https://discord.gg/meyHQYWvjU"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Rejoindre le Discord FRVtubers
                  </a>
                  <a
                    className={styles.utilityLink}
                    href="https://frvtubers.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consulter le site principal
                  </a>
                </div>
              </div>
              <div className={styles.statGrid} aria-label="Aperçu du catalogue">
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{resources.length}</span>
                  <span className={styles.statLabel}>ressources indexées</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.creatorCount}</span>
                  <span className={styles.statLabel}>créateurs référencés</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.freeCount}</span>
                  <span className={styles.statLabel}>ressources gratuites</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.paidCount}</span>
                  <span className={styles.statLabel}>ressources payantes</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={`${shared.section} ${styles.catalogSection}`}>
        <div className={shared.container}>
          <FilterBar
            search={search}
            setSearch={setSearch}
            language={language}
            setLanguage={setLanguage}
            sortBy={sortBy}
            setSortBy={setSortBy}
            languages={languages}
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            showPaid={showPaid}
            setShowPaid={setShowPaid}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
          />
          {loading && (
            <div className={shared.emptyState}>
              <h3>Chargement des assets</h3>
              <p>Appel de l'API FRVtubers....</p>
            </div>
          )}
          {!loading && error && (
            <div className={shared.emptyState}>
              <h3>Impossible de charger via l'API</h3>
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && (
            <>
              <div className={shared.resourceGrid}>
                {filtered.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
              {!filtered.length && (
                <div className={shared.emptyState}>
                  <h3>Aucune ressource trouvée</h3>
                  <p>Essaie un autre mot-clé ou retire un filtre.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
