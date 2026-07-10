import { NavLink } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import shared from '../styles/shared.module.scss'
import styles from './Header.module.scss'

export const Header = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.siteHeader}>
      <div className={`${shared.container} ${styles.headerInner}`}>
        <NavLink to="/" className={styles.brand} aria-label="Accueil">
          <img
            className={styles.brandLogo}
            src="/FRVtubers_Vresources.png"
            alt="FRVResources"
          />
        </NavLink>

        <nav className={styles.navLinks} aria-label="Navigation principale">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
            }
          >
            Catalogue
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
            }
          >
            À propos
          </NavLink>
        </nav>

        <div className={styles.headerActions}>
          <NavLink
            to="/submit"
            className={({ isActive }) =>
              `${styles.submitLink} ${isActive ? styles.submitLinkActive : ''}`.trim()
            }
          >
            Soumettre
          </NavLink>
          <button
            className={styles.themeToggle}
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
          >
            <i
              className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  )
}
