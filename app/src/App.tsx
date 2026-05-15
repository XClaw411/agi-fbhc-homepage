import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GroupLLM from './pages/GroupLLM'
import GroupBiology from './pages/GroupBiology'
import GroupHealth from './pages/GroupHealth'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/groups/llm-agent" element={<GroupLLM />} />
        <Route path="/groups/ai-for-biology" element={<GroupBiology />} />
        <Route path="/groups/ai-for-health" element={<GroupHealth />} />
      </Route>
    </Routes>
  )
}
