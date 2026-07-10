import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import shared from '../styles/shared.module.scss'
import styles from './NotFound.module.scss'

export const NotFound = () => (
  <div className={`${shared.page} ${styles.notFound}`}>
    <Seo
      title="Page introuvable"
      description="La page demandée n'existe pas sur FRVResources."
      canonicalPath="/404"
      noIndex
    />
    <section className={shared.section}>
      <div className={`${shared.container} ${shared.emptyState}`}>
        <h1>Page introuvable</h1>
        <p>La page demandée n'existe pas.</p>
        <Link to="/" className={`${shared.button} ${shared.buttonPrimary}`}>
          Retour à l'accueil
        </Link>
      </div>
    </section>
  </div>
)
