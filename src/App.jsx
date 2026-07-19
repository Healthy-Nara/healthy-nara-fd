import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: localStorage.getItem("nara_token") ? (
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
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
