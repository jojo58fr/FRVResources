import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { ResourceDetail } from './pages/ResourceDetail'
import { Submit } from './pages/Submit'
import { NotFound } from './pages/NotFound'
import styles from './App.module.scss'

export const App = () => (
  <div className={styles.app}>
    <Header />
    <main className={styles.main}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
)
