import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ManageArticlesPage } from "./pages/ManageArticlesPage";
import { RegisterPage } from "./pages/RegisterPage";

function ManageArticlesRoute() {
  const { canManageArticles, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!canManageArticles) {
    return <Navigate to="/" replace />;
  }

  return <ManageArticlesPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/manage/articles" element={<ManageArticlesRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
