import shared from '../styles/shared.module.scss'
import styles from './About.module.scss'
import { Seo } from '../components/Seo'

const introItems = [
  {
    title: 'Centraliser',
    description:
      'Tout est regroupé pour gagner du temps et créer plus sereinement.',
  },
  {
    title: 'Clarifier',
    description:
      'Usage, crédits, langue et lien créateur en un coup d\'oeil.',
  },
  {
    title: 'Rassembler',
    description:
      'Une porte d\'entrée commune pour la communauté francophone.',
  },
]

const communityItems = [
  {
    title: 'Discord actif',
    description:
      'Un espace pour partager, découvrir et soutenir les créateurs francophones.',
  },
  {
    title: 'Collaborations',
    description: 'Des projets communs, évènements et ressources mutualisées.',
  },
  {
    title: 'Ouvert à tous',
    description: 'Vous êtes créateurs ou clippeurs ? Cette place est aussi pour vous.',
  },
]

const supportItems = [
  {
    title: 'Faire connaître',
    description: 'parler du projet autour de vous, en stream ou sur les réseaux.',
  },
  {
    title: 'Contribuer',
    description: 'proposer des ressources gratuites bien créditées et partagées.',
  },
  {
    title: 'Soutenir',
    description: 'Créer autour de FRVtubers ou soutenez via l\'OpenCollective aide à financer l\'hébergement et les outils.',
  },
]

export const About = () => (
  <div className={shared.page}>
    <Seo
      title="A propos de FRVResources - Ressources VtuberFR"
      description="FRVResources centralise les ressources VTuberFR : assets vtuber, live2D FR, overlays, emotes, outils et services pour la communaut\u00e9 vtubing fran\u00e7aise."
      keywords="ressources pour vtuberfr, assets vtuber, asset vtuberfr, live2d fr, vtubing fr, ressources vtuber france"
      canonicalPath="/about"
    />
    <section className={shared.section}>
      <div className={shared.container}>
        <div className={styles.introLayout}>
          <div className={styles.introMain}>
            <p className={shared.eyebrow}>À propos</p>
            <h1>C&apos;est quoi FRVResources ?</h1>
            <p>
              Un hub simple pour trouver vite des ressources fiables pour les créateurs VTubers.
              FRVResources aide la communauté VtuberFR à découvrir des assets vtuber et du
              Live2D FR.
            </p>
          </div>
          <aside className={styles.introAside}>
            <p className={styles.sideTitle}>Le but du projet</p>
            <div className={styles.processList}>
              {introItems.map((item) => (
                <div key={item.title} className={styles.scopeItem}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section className={`${shared.section} ${shared.sectionAlt}`}>
      <div className={shared.container}>
        <div className={shared.sectionHead}>
          <h2>La communauté FRVtubers</h2>
          <p>
            Serveur communautaire francophone de vtubing (VtuberFR). Retrouvez vos créateurs
            préférés et un Discord pour les fans de vtubing.
          </p>
        </div>
        <div className={styles.scopeGrid}>
          {communityItems.map((item) => (
            <article key={item.title} className={styles.scopeItem}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className={shared.section}>
      <div className={shared.container}>
        <div className={shared.sectionHead}>
          <h2>Comment nous aider ?</h2>
          <p>
            Le projet vit grâce à la communauté, avec un soutien transparent via OpenCollective et
            des gestes simples au quotidien.
          </p>
        </div>
        <div className={styles.processList}>
          {supportItems.map((step, index) => (
            <div key={step.title} className={styles.processItem}>
              <span className={styles.processIndex}>0{index + 1}</span>
              <p>
                <strong>{step.title}:</strong> {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className={`${shared.section} ${shared.sectionAlt}`}>
      <div className={shared.container}>
        <div className={styles.linksLayout}>
          <div>
            <p className={shared.eyebrow}>Soutien</p>
            <h2>Le projet avance avec des contributions visibles et utiles.</h2>
            <p>
              OpenCollective permet de soutenir l'hébergement et les outils. Le fonctionnement des
              dons reste expliqué publiquement sur le site principal.
            </p>
          </div>
          <div className={styles.linkPanel}>
            <a
              className={`${shared.button} ${shared.buttonPrimary}`}
              href="https://opencollective.com/frvtubers"
              target="_blank"
              rel="noreferrer"
            >
              Voir OpenCollective
            </a>
            <a
              className={`${shared.button} ${shared.buttonGhost}`}
              href="https://frvtubers.com/dons"
              target="_blank"
              rel="noreferrer"
            >
              Comprendre comment le don fonctionne
            </a>
            <a
              className={`${shared.button} ${shared.buttonGhost}`}
              href="https://frvtubers.com/dons"
              target="_blank"
              rel="noreferrer"
            >
              Contribuer sur GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
)
