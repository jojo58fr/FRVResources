import { Link } from 'react-router-dom'
import shared from '../styles/shared.module.scss'
import styles from './Footer.module.scss'

export const Footer = () => (
  <footer className={styles.siteFooter}>
    <div className={`${shared.container} ${styles.footerInner}`}>
      <div className={styles.footerColumn}>
        <p className={styles.footerTitle}>FRVResources</p>
        <p className={styles.footerCopy}>
          Liste d'assets communautaire de ressources VTuber gratuites. Fait pour faciliter la vie des créateurs.
        </p>
      </div>
      <div className={styles.footerColumn}>
        <p className={styles.footerHeading}>Navigation</p>
        <div className={styles.footerLinks}>
          <Link to="/">Liste d'assets</Link>
          <Link to="/about">À propos</Link>
          <Link to="/submit">Soumettre une ressource</Link>
        </div>
      </div>
      <div className={styles.footerColumn}>
        <p className={styles.footerHeading}>Projet</p>
        <div className={styles.footerLinks}>
          <a href="https://frvtubers.com/contact">Contact</a>
          <a href="https://frvtubers.com" target="_blank" rel="noreferrer">
            Site principal
          </a>
          <a href="https://discord.gg/meyHQYWvjU" target="_blank" rel="noreferrer">
            Discord FRVtubers
          </a>
        </div>
      </div>
    </div>
  </footer>
)
