import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ManageArticlesPage } from "./pages/ManageArticlesPage";
import { RegisterPage } from "./pages/RegisterPage";

function ManageRoute() {
  const { canManageArticles } = useAuth();
  if (!canManageArticles) return <Navigate to="/login" replace />;
  return <ManageArticlesPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/manage/articles" element={<ManageRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
