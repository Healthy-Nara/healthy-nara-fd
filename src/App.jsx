import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import "./App.css"
import MainLayout from "./layouts/MainLayout"
import Login from "./components/pages/Login"
import Home from "./components/pages/Home"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token")

  if (token) {
    return <Navigate to="/home" replace />
  }

  return children
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: localStorage.getItem("token") ? (
        <Navigate to="/home" replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <MainLayout />
        </PublicRoute>
      ),
      children: [
        {
          index: true,
          element: <Login />,
        },
      ],
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App