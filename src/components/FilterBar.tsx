import shared from '../styles/shared.module.scss'
import styles from './FilterBar.module.scss'
import type { TagOption } from '../hooks/useResourceTags'

const formatTagLabel = (value: string) =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

type FilterBarProps = {
  search: string
  setSearch: (value: string) => void
  language: string
  setLanguage: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  languages: string[]
  tags: TagOption[]
  selectedTags: string[]
  setSelectedTags: (value: string[]) => void
  showPaid: boolean
  setShowPaid: (value: boolean) => void
  priceMin: string
  setPriceMin: (value: string) => void
  priceMax: string
  setPriceMax: (value: string) => void
}

export const FilterBar = ({
  search,
  setSearch,
  language,
  setLanguage,
  sortBy,
  setSortBy,
  languages,
  tags,
  selectedTags,
  setSelectedTags,
  showPaid,
  setShowPaid,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
}: FilterBarProps) => (
  <div className={styles.filterBar}>
    <div className={styles.filterBarRow}>
      <div className={`${shared.field} ${styles.rechercheInputField}`}>
        <label htmlFor="search">Recherche rapide</label>
        <input
          id="search"
          type="search"
          placeholder="Overlay pastel, emote chibi..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className={`${shared.field} ${styles.languageInputField}`}>
        <label htmlFor="language">Langue</label>
        <select id="language" value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="">Toutes</option>
          {languages.map((item) => (
            <option key={item} value={item}>
              {item === 'OTHER' ? 'Autres' : item}
            </option>
          ))}
        </select>
      </div>
      <div className={`${shared.field} ${styles.sortInputField}`}>
        <label htmlFor="sortBy">Trier par</label>
        <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="newest">Le plus récent (par défaut)</option>
          <option value="featured">Mis en avant</option>
          <option value="oldest">Le plus ancien</option>
          <option value="most_popular">Les plus populaires</option>
          <option value="least_popular">Les moins populaires</option>
        </select>
      </div>

      <div className={`${styles.toggleField} ${styles.toggleInputField}`}>
        <label className={styles.toggleRow} htmlFor="show-paid">
          <input
            id="show-paid"
            type="checkbox"
            checked={showPaid}
            onChange={(event) => setShowPaid(event.target.checked)}
          />
          <span className={styles.toggleTrack} aria-hidden="true" />
          <span className={styles.toggleText}>Afficher les ressources payantes</span>
        </label>
      </div>
    </div>

    {showPaid && (
      <div className={styles.filterBarRow}>
        <div className={`${shared.field} ${styles.priceInputField}`}>
          <label htmlFor="price-min">Prix min</label>
          <input
            id="price-min"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="0"
            value={priceMin}
            onChange={(event) => setPriceMin(event.target.value)}
          />
        </div>
        <div className={`${shared.field} ${styles.priceInputField}`}>
          <label htmlFor="price-max">Prix max</label>
          <input
            id="price-max"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="50"
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
          />
        </div>
      </div>
    )}

    {tags.length > 0 && (
      <div className={styles.filterBarRow}>
        <div className={styles.tagFilter}>
          <div className={styles.tagHeader}>
            <span className={styles.tagLabel}>Tags</span>
            <div className={styles.tagControls}>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  className={styles.tagClear}
                  onClick={() => setSelectedTags([])}
                >
                  Tout effacer
                </button>
              )}
            </div>
          </div>
          <div className={styles.tagList}>
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag.slug)
              return (
                <button
                  key={tag.slug}
                  type="button"
                  className={`${styles.tagChip} ${isActive ? styles.tagChipActive : ''}`.trim()}
                  onClick={() =>
                    setSelectedTags(
                      isActive
                        ? selectedTags.filter((item) => item !== tag.slug)
                        : [...selectedTags, tag.slug],
                    )
                  }
                >
                  <span>{formatTagLabel(tag.label ?? tag.slug)}</span>
                  <span className={styles.tagCount}>{tag.count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )}
  </div>
)
