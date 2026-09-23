import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SiteHeader } from '@/components/site/site-header'
import { DocsLayout } from '@/layouts/docs-layout'
import { DocPage } from '@/pages/docs/doc-page'
import { Home } from '@/pages/home'

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<Navigate to="introduction" replace />} />
          <Route path=":slug" element={<DocPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
