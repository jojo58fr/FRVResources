import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import type { ResourceItem } from '../data/resources'
import { trackResourceClick } from '../data/frvtubersApi'
import styles from './ResourceCard.module.scss'

type ResourceCardProps = {
  resource: ResourceItem
}

const formatLanguageLabel = (value: string) => (value === 'OTHER' ? 'Other' : value)
const formatTagLabel = (value: string) =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
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

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isHoverPreviewOpen, setIsHoverPreviewOpen] = useState(false)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()
  const suppressCardClickRef = useRef(false)
  const hasWebmPreview = isWebm(resource.previewImageUrl)
  const hasAnimatedImage = isAnimatedImage(resource.previewImageUrl)

  const portalTarget = useMemo(() => (typeof document !== 'undefined' ? document.body : null), [])

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

  const updateHoverPosition = (event: MouseEvent<HTMLButtonElement>) => {
    const offset = 16
    const previewWidth = 260
    const previewHeight = 180
    const maxX = window.innerWidth - previewWidth - 12
    const maxY = window.innerHeight - previewHeight - 12
    const nextX = Math.min(Math.max(event.clientX + offset, 12), maxX)
    const nextY = Math.min(Math.max(event.clientY + offset, 12), maxY)
    setHoverPosition({ x: nextX, y: nextY })
  }

  const handleOpenDetail = () => {
    navigate(`/resource/${resource.id}`)
  }

  const closePreview = () => {
    suppressCardClickRef.current = true
    setIsPreviewOpen(false)
    window.setTimeout(() => {
      suppressCardClickRef.current = false
    }, 0)
  }

  const handleCardKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenDetail()
    }
  }

  return (
    <article
      className={styles.resourceCard}
      role="link"
      tabIndex={0}
      aria-label={`Voir le detail de ${resource.title}`}
      onClick={() => {
        if (suppressCardClickRef.current || isPreviewOpen) return
        handleOpenDetail()
      }}
      onKeyDown={handleCardKeyDown}
    >
      <div
        className={`${styles.resourceThumb} ${
          resource.previewImageUrl ? styles.resourceThumbHasImage : ''
        }`.trim()}
        style={
          resource.previewImageUrl && !hasWebmPreview && !hasAnimatedImage
            ? { backgroundImage: `url(${resource.previewImageUrl})` }
            : { background: resource.accent }
        }
      >
        {!resource.previewImageUrl && <span>{resource.title.slice(0, 2).toUpperCase()}</span>}
        {resource.previewImageUrl && hasWebmPreview && (
          <video
            className={styles.previewThumbMedia}
            src={resource.previewImageUrl}
            muted
            autoPlay
            loop
            playsInline
          />
        )}
        {resource.previewImageUrl && !hasWebmPreview && hasAnimatedImage && (
          <img
            className={styles.previewThumbMedia}
            src={resource.previewImageUrl}
            alt={resource.title}
            loading="lazy"
          />
        )}
        {resource.previewImageUrl && (
          <button
            type="button"
            className={styles.previewButton}
            onClick={(event) => {
              event.stopPropagation()
              setIsPreviewOpen(true)
            }}
            onMouseEnter={(event) => {
              updateHoverPosition(event)
              setIsHoverPreviewOpen(true)
            }}
            onMouseMove={updateHoverPosition}
            onMouseLeave={() => setIsHoverPreviewOpen(false)}
            aria-label={`Voir ${resource.title} en plus grand`}
            title="Voir en plus grand"
          >
            <i className="fa-solid fa-magnifying-glass-plus" />
            <span>Voir + grand</span>
          </button>
        )}
      </div>
      <div className={styles.resourceContent}>
        <div className={styles.resourceMeta}>
          {(resource.price === 0 || resource.price === null) && (
            <span className={styles.resourceBadge}>Gratuit</span>
          )}
          {resource.price !== 0 && resource.price !== null && (
            <span className={styles.resourceCategory}>
              {resource.price ? `${resource.price}€` : 'Prix N/A'}
            </span>
          )}
          {resource.type && <span className={styles.resourceType}>{formatTagLabel(resource.type)}</span>}
          <span className={styles.resourceLanguage}>
            {resource.languages.length ? (
              <span className={styles.languageIcons}>
                {resource.languages.map((language) => {
                  if (language === 'OTHER') {
                    return (
                      <span
                        key={language}
                        className={styles.languageIcon}
                        title={formatLanguageLabel(language)}
                        aria-label={formatLanguageLabel(language)}
                      >
                        <i className="fa-solid fa-globe" />
                      </span>
                    )
                  }

                  const flagClass = language === 'FR' ? 'fi-fr' : 'fi-gb'
                  return (
                    <span
                      key={language}
                      className={`${styles.languageFlag} fi ${flagClass}`}
                      title={formatLanguageLabel(language)}
                      aria-label={formatLanguageLabel(language)}
                    />
                  )
                })}
              </span>
            ) : (
              'Langue non précisée'
            )}
          </span>
        </div>
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        {resource.tags.length > 0 && (
          <div className={styles.resourceTags} aria-label="Tags">
            {resource.tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>
                {formatTagLabel(tag)}
              </span>
            ))}
          </div>
        )}
        <div className={styles.resourceFooter}>
          <span>Par {resource.creator}</span>
          <div className={styles.resourceActions}>
            <a
              className={styles.resourceIconLink}
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              aria-label="Ouvrir l'asset"
              title="Ouvrir l'asset"
              onClick={(event) => {
                event.stopPropagation()
                trackResourceClick(resource.id)
              }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square" />
              <span>Ouvrir le site</span>
            </a>
            <Link
              className={styles.resourceLink}
              to={`/resource/${resource.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              Voir en détail
            </Link>
          </div>
        </div>
      </div>
      {isPreviewOpen && resource.previewImageUrl && portalTarget
        ? createPortal(
            <div
              className={styles.previewOverlay}
              role="dialog"
              aria-modal="true"
              aria-label={`Previsualisation de ${resource.title}`}
              onClick={(event) => {
                event.preventDefault()
                closePreview()
              }}
            >
              <div
                className={styles.previewDialog}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.previewClose}
                  onClick={(event) => {
                    event.stopPropagation()
                    closePreview()
                  }}
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
                  <img className={styles.previewMedia} src={resource.previewImageUrl} alt={resource.title} />
                )}
              </div>
            </div>,
            portalTarget,
          )
        : null}
      {isHoverPreviewOpen && resource.previewImageUrl && portalTarget
        ? createPortal(
            <div
              className={styles.hoverPreview}
              style={{ top: `${hoverPosition.y}px`, left: `${hoverPosition.x}px` }}
            >
              {hasWebmPreview ? (
                <video
                  className={styles.hoverPreviewMedia}
                  src={resource.previewImageUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img
                  className={styles.hoverPreviewMedia}
                  src={resource.previewImageUrl}
                  alt={resource.title}
                />
              )}
            </div>,
            portalTarget,
          )
        : null}
    </article>
  )
}
