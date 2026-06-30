import { GlobalModal } from "@components/GlobalModal"
import { GuestRoute } from "@components/GuestRoute"
import { ProtectedRoute } from "@components/ProtectedRoute"
import { useAuthInit } from "@hooks/useAuthInit"
import { Layout } from "@layout/Layout"
import { PublicLayout } from "@layout/PublicLayout"
import { LoadingOverlay } from "@mantine/core"
import { appRoutes, publicRoutes } from "@settings/routesConfig"
import { Route, Routes } from "react-router-dom"

function App() {
  const { isInitialized } = useAuthInit()

  if (!isInitialized) return <LoadingOverlay visible />

  return (
    <>
      <GlobalModal />

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {appRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>

        <Route element={<GuestRoute />}>
          <Route element={<PublicLayout />}>
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
