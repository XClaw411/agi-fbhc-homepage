import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import GroupLLM from './pages/GroupLLM'
import GroupBiology from './pages/GroupBiology'
import GroupHealth from './pages/GroupHealth'

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/groups/llm-agent" element={<GroupLLM />} />
            <Route path="/groups/ai-for-biology" element={<GroupBiology />} />
            <Route path="/groups/ai-for-health" element={<GroupHealth />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  )
}
