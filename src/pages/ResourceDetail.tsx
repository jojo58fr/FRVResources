import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { ResourceCard } from '../components/ResourceCard'
import { Seo } from '../components/Seo'
import { trackResourceClick } from '../data/frvtubersApi'
import { useResources } from '../hooks/useResources'
import shared from '../styles/shared.module.scss'
import styles from './ResourceDetail.module.scss'

const formatLanguageLabel = (value: string) => (value === 'OTHER' ? 'Other' : value)
const formatTagLabel = (value: string) =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
const formatTypeLabel = (value: string) => formatTagLabel(value)
const isWebm = (value?: string) => {
  if (!value) return false
  const normalized = value.split('?')[0]?.toLowerCase()
  return normalized?.endsWith('.webm') ?? false
}

const isAnimatedImage = (value?: string) => {
  if (!value) return false
  const normalized = value.split('?')[0]?.toLowerCase()
  return normalized?.endsWith('.gif') || normalized?.endsWith('.apng')
}

const formatDateLabel = (value?: string | null) => {
  if (!value) return 'Non renseignée'

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return 'Non renseignée'

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}
const formatPriceLabel = (price?: number | null) =>
  price === 0 || price === null ? 'Gratuit' : price ? `${price}€` : 'Prix N/A'

const shuffleList = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

export const ResourceDetail = () => {
  const { id } = useParams()
  const { resources, loading, error } = useResources()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const resource = resources.find((item) => item.id === id)
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://frvtubers.com'
  const portalTarget = useMemo(() => (typeof document !== 'undefined' ? document.body : null), [])
  const hasWebmPreview = isWebm(resource?.previewImageUrl)
  const hasAnimatedImage = isAnimatedImage(resource?.previewImageUrl)
  const discoveryGroups = (() => {
    const others = resources.filter((item) => item.id !== id)
    const grouped = new Map<string, typeof others>()

    others.forEach((item) => {
      const typeKey = item.type?.trim() || 'Autres'
      const bucket = grouped.get(typeKey) ?? []
      bucket.push(item)
      grouped.set(typeKey, bucket)
    })

    const currentType = resource?.type?.trim()
    const entries = Array.from(grouped.entries()).map(([type, items]) => ({
      type,
      items: shuffleList(items).slice(0, 3),
    }))

    const ordered = currentType
      ? [
          ...entries.filter((entry) => entry.type === currentType),
          ...shuffleList(entries.filter((entry) => entry.type !== currentType)),
        ]
      : shuffleList(entries)

    return ordered.slice(0, 3)
  })()

  useEffect(() => {
    if (!isPreviewOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreviewOpen])

  if (loading) {
    return (
      <div className={shared.page}>
        <Seo
          title="Chargement d'une ressource VTuberFR"
          description="Chargement d'une ressource vtuber sur FRVResources."
          canonicalPath={id ? `/resource/${id}` : undefined}
        />
        <section className={shared.section}>
          <div className={`${shared.container} ${shared.emptyState}`}>
            <h1>Chargement de l'asset</h1>
            <p>Appel de l'API FRVtubers...</p>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className={shared.page}>
        <Seo
          title="Erreur de chargement - Ressource VTuberFR"
          description="Impossible de charger cette ressource vtuber. Réessaie plus tard."
          canonicalPath={id ? `/resource/${id}` : undefined}
          noIndex
        />
        <section className={shared.section}>
          <div className={`${shared.container} ${shared.emptyState}`}>
            <h1>Impossible de charger la ressource</h1>
            <p>{error}</p>
            <Link to="/" className={`${shared.button} ${shared.buttonPrimary}`}>
              Retour à l'accueil
            </Link>
          </div>
        </section>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className={shared.page}>
        <Seo
          title="Ressource introuvable"
          description="La ressource vtuber demandée n'existe pas ou a été déplacée."
          canonicalPath={id ? `/resource/${id}` : undefined}
          noIndex
        />
        <section className={shared.section}>
          <div className={`${shared.container} ${shared.emptyState}`}>
            <h1>Ressource introuvable</h1>
            <p>La fiche demandée n'existe pas ou a été déplacée.</p>
            <Link to="/" className={`${shared.button} ${shared.buttonPrimary}`}>
              Retour à l'accueil
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={shared.page}>
      <Seo
        title={`${resource.title} - Asset VTuberFR`}
        description={`${resource.title} par ${resource.creator}. ${resource.description}`}
        keywords={`asset vtuber, ressources vtuberfr, ${resource.title}, ${resource.creator}`}
        canonicalPath={`/resource/${resource.id}`}
        image={resource.previewImageUrl ? resource.previewImageUrl : `${siteUrl}/FRVtubers_Vresources.png`}
        type="article"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: resource.title,
            description: resource.description,
            url: new URL(`/resource/${resource.id}`, siteUrl).toString(),
            creator: { '@type': 'Person', name: resource.creator },
            inLanguage: resource.languages.length ? resource.languages : ['fr-FR'],
            keywords: resource.tags,
          },
        ]}
      />
      <section className={shared.section}>
        <div className={shared.container}>
          <Link to="/" className={styles.backLink}>
            Retour au catalogue
          </Link>
          <div className={styles.detailLayout}>
            <aside className={styles.mediaPanel}>
              <div
                className={`${styles.detailHero} ${
                  resource.previewImageUrl ? styles.detailHeroHasImage : ''
                }`.trim()}
                style={
                  resource.previewImageUrl
                    ? { backgroundImage: `url(${resource.previewImageUrl})` }
                    : { background: resource.accent }
                }
              >
                {!resource.previewImageUrl && <span>{resource.title.slice(0, 2).toUpperCase()}</span>}
              </div>
              <div className={styles.mediaPanelBody}>
                <div className={styles.mediaMeta}>
                  <span>Ajouté le {formatDateLabel(resource.createdAt)}</span>
                </div>
                <div className={styles.mediaActions}>
                  {resource.previewImageUrl && (
                    <button
                      type="button"
                      className={`${shared.button} ${shared.buttonGhost}`}
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <i className="fa-solid fa-magnifying-glass-plus" aria-hidden="true" />
                      <span>Voir plus grand</span>
                    </button>
                  )}
                  <a
                    className={`${shared.button} ${shared.buttonPrimary}`}
                    href={resource.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackResourceClick(resource.id)}
                  >
                    Ouvrir la ressource
                  </a>
                </div>
              </div>
            </aside>

            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <p className={shared.eyebrow}>Asset</p>
                <h1>{resource.title}</h1>
                <div className={styles.tagBlock}>
                  <p className={styles.detailLabel}>Tags</p>
                  <div className={styles.tagRow}>
                    {resource.tags.length ? (
                      resource.tags.map((tag) => (
                        <span key={tag} className={styles.tagPill}>
                          {formatTagLabel(tag)}
                        </span>
                      ))
                    ) : (
                      <span className={`${styles.tagPill} ${styles.tagPillMuted}`}>Aucun tag</span>
                    )}
                  </div>
                </div>
                <p className={styles.detailDescription}>{resource.description}</p>
              </div>
              <div className={styles.detailFacts}>
                <div>
                  <p className={styles.detailLabel}>Créateur</p>
                  <p>{resource.creator}</p>
                </div>
                <div>
                  <p className={styles.detailLabel}>Type</p>
                  <p>{resource.type ? formatTypeLabel(resource.type) : 'Non précisé'}</p>
                </div>
                <div>
                  <p className={styles.detailLabel}>Prix</p>
                  <p>{formatPriceLabel(resource.price)}</p>
                </div>
                <div>
                  <p className={styles.detailLabel}>Langues</p>
                  <div className={styles.tagRow}>
                    {(resource.languages.length ? resource.languages : ['Non précisé']).map((tag) => (
                      <span
                        key={tag}
                        className={`${styles.languagePill} lang-${tag.toLowerCase()}`}
                      >
                        {tag === 'OTHER' && (
                          <span className={styles.languageIcon} aria-hidden="true">
                            <i className="fa-solid fa-globe" />
                          </span>
                        )}
                        {(tag === 'FR' || tag === 'EN') && (
                          <span
                            className={`${styles.languageFlag} fi ${tag === 'FR' ? 'fi-fr' : 'fi-gb'}`}
                            aria-hidden="true"
                          />
                        )}
                        {formatLanguageLabel(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.detailActions}>
                <Link to="/" className={`${shared.button} ${shared.buttonGhost}`}>
                  Retour à la liste
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${shared.section} ${shared.sectionAlt}`}>
        <div className={shared.container}>
          <div className={shared.sectionHead}>
            <h2>Ressources à découvrir</h2>
            <p>Autres assets regroupées par type pour poursuivre la recherche.</p>
          </div>
          {discoveryGroups.length ? (
            <div className={styles.discoveryGroups}>
              {discoveryGroups.map((group) => (
                <div key={group.type} className={styles.discoveryGroup}>
                  <div className={styles.discoveryHeader}>
                    <h3>{formatTypeLabel(group.type)}</h3>
                    <span className={styles.discoveryType}>{group.items.length} ressources</span>
                  </div>
                  <div className={shared.resourceGrid}>
                    {group.items.map((item) => (
                      <ResourceCard key={item.id} resource={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={shared.emptyState}>
              <h3>Aucune ressource similaire</h3>
              <p>Reviens plus tard pour découvrir de nouvelles propositions.</p>
            </div>
          )}
        </div>
      </section>
      {isPreviewOpen && resource.previewImageUrl && portalTarget
        ? createPortal(
            <div
              className={styles.previewOverlay}
              role="dialog"
              aria-modal="true"
              aria-label={`Previsualisation de ${resource.title}`}
              onClick={() => setIsPreviewOpen(false)}
            >
              <div className={styles.previewDialog} onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className={styles.previewClose}
                  onClick={() => setIsPreviewOpen(false)}
                  aria-label="Fermer la previsualisation"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
                {hasWebmPreview ? (
                  <video
                    className={styles.previewMedia}
                    src={resource.previewImageUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    className={styles.previewMedia}
                    src={resource.previewImageUrl}
                    alt={resource.title}
                  />
                )}
                {hasAnimatedImage && (
                  <span className={styles.previewHint}>Aperçu anime en taille reelle</span>
                )}
              </div>
            </div>,
            portalTarget,
          )
        : null}
    </div>
  )
}
