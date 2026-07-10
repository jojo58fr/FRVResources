import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ResourceCard } from '../components/ResourceCard'
import { Seo } from '../components/Seo'
import { buildApiUrl } from '../data/frvtubersApi'
import { languageOptions } from '../data/resources'
import { useResources } from '../hooks/useResources'
import shared from '../styles/shared.module.scss'
import styles from './Submit.module.scss'

type SubmitFormState = {
  submitterName: string
  submitterEmail: string
  submitterDiscord: string
  assetTitle: string
  creatorName: string
  assetUrl: string
  description: string
  previewImageUrl: string
  price: string
  languages: string[]
}

const initialFormState: SubmitFormState = {
  submitterName: '',
  submitterEmail: '',
  submitterDiscord: '',
  assetTitle: '',
  creatorName: '',
  assetUrl: '',
  description: '',
  previewImageUrl: '',
  price: '',
  languages: [],
}

const preparationItems = [
  'Assures toi de donner le lien vers l\'asset directement.',
  'Plus les informations seront bien renseignés, plus vite l\'asset sera référencée',
  'Ajoutes un aperçu visuel (gif, png, mp4...)'
]



export const Submit = () => {
  const [form, setForm] = useState(initialFormState)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(0)
  const { resources, loading, error, refresh } = useResources(12)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleLanguage = (value: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(value)
        ? prev.languages.filter((lang) => lang !== value)
        : [...prev.languages, value],
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    if (!form.submitterName || !form.assetTitle || !form.creatorName || !form.assetUrl) {
      setStatus('error')
      setMessage("Merci de renseigner votre nom, le titre, le créateur et le lien de l'asset.")
      return
    }

    const priceValue = form.price.trim() ? Number(form.price.replace(',', '.')) : null
    if (form.price.trim() && Number.isNaN(priceValue)) {
      setStatus('error')
      setMessage('Le prix doit être un nombre (ex: 0 pour gratuit).')
      return
    }

    const payload = {
      submitterName: form.submitterName.trim(),
      submitterEmail: form.submitterEmail.trim() || undefined,
      submitterDiscord: form.submitterDiscord.trim() || undefined,
      assetTitle: form.assetTitle.trim(),
      creatorName: form.creatorName.trim(),
      assetUrl: form.assetUrl.trim(),
      description: form.description.trim() || undefined,
      previewImageUrl: form.previewImageUrl.trim() || undefined,
      price: priceValue ?? undefined,
      languages: form.languages.length ? form.languages : undefined,
    }

    try {
      const response = await fetch(buildApiUrl('/api/resources'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        const errorMessage =
          errorPayload && typeof errorPayload === 'object' && 'error' in errorPayload
            ? String((errorPayload as { error?: string }).error)
            : "Impossible d'envoyer la ressource."
        throw new Error(errorMessage)
      }

      setStatus('success')
      setMessage('Merci ! Ta ressource est envoyée pour validation.')
      setForm(initialFormState)
      setStep(0)
      refresh()
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue.')
    }
  }

  const steps = [
    {
      title: 'Tes infos',
      description: 'Quelques infos pour te recontacter si besoin.',
    },
    {
      title: "L'asset",
      description: 'Le coeur de la ressource à partager.',
    },
    {
      title: 'Détails',
      description: 'Un petit plus pour aider la communauté.',
    },
  ]

  const isStepValid = (index: number) => {
    if (index === 0) {
      return Boolean(form.submitterName.trim())
    }

    if (index === 1) {
      return Boolean(
        form.assetTitle.trim() && form.creatorName.trim() && form.assetUrl.trim(),
      )
    }

    return true
  }

  const goNext = () => {
    if (!isStepValid(step)) {
      setStatus('error')
      setMessage('Complète les champs obligatoires pour continuer.')
      return
    }

    setStatus('idle')
    setMessage('')
    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const goPrevious = () => {
    setStatus('idle')
    setMessage('')
    setStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className={shared.page}>
      <Seo
        title="Soumettre un asset VTuberFR"
        description="Ajoute un asset vtuber, live2D FR, overlay ou ressource vtubing FR \u00e0 FRVResources pour aider la communaut\u00e9 VtuberFR."
        keywords="soumettre asset vtuber, ressources vtuberfr, live2d fr, overlay vtuber, vtubing fr"
        canonicalPath="/submit"
      />
      <section className={shared.section}>
        <div className={shared.container}>
          <div className={styles.submitIntro}>
            <div className={styles.submitIntroMain}>
              <p className={shared.eyebrow}>Soumission</p>
              <h1>Soumettre une ressource</h1>
              <p>
                Merci de partager des ressources pour la communauté VTuber. Chaque soumission est vérifiée avant d'être ajoutée sur la home, pour garder des assets vtuber de qualité.
              </p>
            </div>
            <aside className={styles.submitIntroAside}>
              <p className={styles.sideTitle}>Ce que l'équipe vérifie</p>
              <ul className={styles.sideList}>
                <li>On vérifie le créateur, le contenu proposer</li>
                <li>La description y est repréciser pour fournir une traduction françaises ou des tags sur l'asset proposé</li>
                <li>On valide ensuite la fiche en faisant apparaître créateur, qui as soumis pour une traçabilité au top !</li>
              </ul>
            </aside>
          </div>

          <div className={styles.submitLayout}>
            <div className={styles.submitCard}>
              <form className={styles.submitForm} onSubmit={handleSubmit}>
                <div className={styles.stepHeader}>
                  <div>
                    <span className={styles.stepOverline}>
                      Etape {step + 1} / {steps.length}
                    </span>
                    <h2>{steps[step].title}</h2>
                    <p>{steps[step].description}</p>
                  </div>
                  <div className={styles.stepProgress}>
                    {steps.map((item, index) => (
                      <button
                        key={item.title}
                        type="button"
                        className={`${styles.stepChip} ${index === step ? styles.stepChipActive : ''} ${
                          index < step ? styles.stepChipDone : ''
                        }`.trim()}
                        onClick={() => setStep(index)}
                        aria-current={index === step ? 'step' : undefined}
                      >
                        <span>{index + 1}</span>
                        {item.title}
                      </button>
                    ))}
                  </div>
                  <div className={styles.progressTrack} aria-hidden="true">
                    <div
                      className={styles.progressFill}
                      style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {step === 0 && (
                  <div className={styles.stepBody}>
                    <div className={styles.formGrid}>
                      <div className={shared.field}>
                        <label htmlFor="submitterName">Ton nom *</label>
                        <input
                          id="submitterName"
                          name="submitterName"
                          value={form.submitterName}
                          onChange={handleChange}
                          placeholder="Ton nom"
                          required
                        />
                      </div>
                      <div className={shared.field}>
                        <label htmlFor="submitterEmail">Email (optionnel)</label>
                        <input
                          id="submitterEmail"
                          name="submitterEmail"
                          type="email"
                          value={form.submitterEmail}
                          onChange={handleChange}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className={shared.field}>
                        <label htmlFor="submitterDiscord">Discord (optionnel)</label>
                        <input
                          id="submitterDiscord"
                          name="submitterDiscord"
                          value={form.submitterDiscord}
                          onChange={handleChange}
                          placeholder="@pseudo#1234"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className={styles.stepBody}>
                    <div className={styles.formGrid}>
                      <div className={shared.field}>
                        <label htmlFor="assetTitle">Titre de l'asset *</label>
                        <input
                          id="assetTitle"
                          name="assetTitle"
                          value={form.assetTitle}
                          onChange={handleChange}
                          placeholder="Titre de l'asset"
                          required
                        />
                      </div>
                      <div className={shared.field}>
                        <label htmlFor="creatorName">Nom du créateur *</label>
                        <input
                          id="creatorName"
                          name="creatorName"
                          value={form.creatorName}
                          onChange={handleChange}
                          placeholder="Nom du créateur"
                          required
                        />
                      </div>
                      <div className={shared.field}>
                        <label htmlFor="assetUrl">Lien de l'asset *</label>
                        <input
                          id="assetUrl"
                          name="assetUrl"
                          type="url"
                          value={form.assetUrl}
                          onChange={handleChange}
                          placeholder="https://exemple.com/asset"
                          required
                        />
                      </div>
                      <div className={shared.field}>
                        <label htmlFor="previewImageUrl">Image de preview (optionnel)</label>
                        <input
                          id="previewImageUrl"
                          name="previewImageUrl"
                          type="url"
                          value={form.previewImageUrl}
                          onChange={handleChange}
                          placeholder="https://exemple.com/preview.png"
                        />
                      </div>
                      <div className={shared.field}>
                        <label htmlFor="price">Prix (0 = gratuit)</label>
                        <input
                          id="price"
                          name="price"
                          inputMode="decimal"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className={styles.stepBody}>
                    <div className={shared.field}>
                      <label htmlFor="description">Description (optionnel)</label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Décris rapidement la ressource."
                      />
                    </div>
                    <div className={shared.field}>
                      <span className={styles.labelInline}>Langues</span>
                      <div className={styles.checkboxRow}>
                        {languageOptions.map((option) => (
                          <label key={option.value} className={styles.checkboxItem}>
                            <input
                              type="checkbox"
                              checked={form.languages.includes(option.value)}
                              onChange={() => toggleLanguage(option.value)}
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={`${shared.button} ${shared.buttonGhost}`}
                    onClick={goPrevious}
                    disabled={step === 0 || status === 'submitting'}
                  >
                    Retour
                  </button>
                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      className={`${shared.button} ${shared.buttonPrimary}`}
                      onClick={goNext}
                      disabled={!isStepValid(step) || status === 'submitting'}
                    >
                      Continuer
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`${shared.button} ${shared.buttonPrimary}`}
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer la ressource'}
                    </button>
                  )}
                </div>
                {message && (
                  <div
                    className={`${styles.formFeedback} ${
                      status === 'success'
                        ? styles.formFeedbackSuccess
                        : status === 'error'
                        ? styles.formFeedbackError
                        : ''
                    }`.trim()}
                  >
                    <p>{message}</p>
                  </div>
                )}
              </form>
            </div>
            <div className={styles.submitAside}>
              <div className={shared.asideCard}>
                <h3>Préparer avant envoi</h3>
                <ul>
                  {preparationItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={shared.asideCard}>
                <h3>Besoin d'aide ?</h3>
                <p>Contacte-nous via ticket discord ou sur le site si tu as un doute sur les droits, les crédits ou la source.</p>
                <a href="https://frvtubers.com/contact" className={`${shared.button} ${shared.buttonGhost}`}>
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${shared.section} ${shared.sectionAlt}`}>
        <div className={shared.container}>
          <div className={shared.sectionHead}>
            <h2>Ressources déjà en ligne</h2>
            <p>Voici une sélection des derniers assets approuvés.</p>
          </div>
          {loading && (
            <div className={shared.emptyState}>
              <h3>Chargement des ressources...</h3>
              <p>On récupère les assets publics depuis l'API.</p>
            </div>
          )}
          {!loading && error && (
            <div className={shared.emptyState}>
              <h3>Impossible de charger les ressources</h3>
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className={shared.resourceGrid}>
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
