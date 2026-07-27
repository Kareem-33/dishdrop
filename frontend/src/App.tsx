import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Footer from "./components/layout/Footer";
import Recipe from "./pages/Recipe";
import SavedRecipes from "./pages/SavedRecipes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Collections from "./pages/Collections";
import Settings from "./pages/Settings";
import EditRecipe from "./pages/EditRecipe";
import ScrollToTop from "./components/ui/ScrollToTop";
import ResetPassword from "./pages/ResetPassword";
import EmailVerified from "./pages/EmailVerified";
import useAuthStore from "./stores/useAuthStore";
import RecipeAnalyze from "./pages/RecipeAnalyze";
import Collection from "./pages/Collection";

function App() {
  const { user, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="bg-page overflow-x-hidden min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/r/analyze" element={<RecipeAnalyze />} />
        <Route path="/r/:id" element={<Recipe />} />
        <Route path="/r/:id/edit" element={<EditRecipe />} />
        <Route path="/r/saved" element={<SavedRecipes />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/c" element={<Collections />} />
        <Route path="/c/:id" element={<Collection />} />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/" />}
        />
        <Route
          path="/email-verified"
          element={
            user ? (
              user.isVerified ? (
                <EmailVerified />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
